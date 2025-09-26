import { UserRepository } from '../repositories/user.repository';
import { LoginUserInput, RegisterUserInput } from '../schemas/user.schema';
import { UserDocument } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { MailService } from './mail.service';

type LoginSuccessResponse = {
  token: string;
  user: Partial<UserDocument>;
};

type ServiceErrorResponse = {
  error: string;
};

type UserSuccessResponse = Partial<UserDocument>;

export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly mailService: MailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.mailService = new MailService();
  }

  public async register(
    userData: RegisterUserInput,
  ): Promise<UserSuccessResponse | ServiceErrorResponse> {
    const { email, phone } = userData;

    if (await this.userRepository.getByEmail(email)) {
      return { error: 'Email is already in use.' };
    }
    if (phone && (await this.userRepository.getByPhone(phone))) {
      return { error: 'Phone number is already in use.' };
    }

    const newUser = await this.userRepository.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      passwordHash: userData.password,
    });

    const verificationToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    this.mailService
      .sendVerificationEmail(newUser.email, newUser.name, verificationToken)
      .catch((err) => {
        console.error('Failed to send verification email:', err);
      });

    const userObject = newUser.toObject();
    delete userObject.passwordHash;
    return userObject;
  }

  public async verifyEmail(token: string): Promise<{ message: string } | ServiceErrorResponse> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await this.userRepository.getById(decoded.id);

      if (!user) {
        return { error: 'User not found.' };
      }
      if (user.emailVerified) {
        return { message: 'Email is already verified.' };
      }

      user.emailVerified = true;
      await user.save();

      return { message: 'Email verified successfully!' };
    } catch (error) {
      return { error: 'Invalid or expired verification token.' };
    }
  }

  public async login(
    credentials: LoginUserInput,
  ): Promise<LoginSuccessResponse | ServiceErrorResponse> {
    const { email, password } = credentials;

    if (!email) {
      return { error: 'Email is required.' };
    }

    const user = await this.userRepository.getByEmail(email, true);

    if (!user || !user.passwordHash) {
      return { error: 'Invalid credentials.' };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return { error: 'Invalid credentials.' };
    }

    if (!user.emailVerified) {
      return { error: 'Please verify your email address before logging in.' };
    }

    await user.populate('favorites');

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    const userObject = user.toObject();
    delete userObject.passwordHash;

    return { token, user: userObject };
  }
}
