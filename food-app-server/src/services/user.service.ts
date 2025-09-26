import { UserRepository } from '../repositories/user.repository';
import { Address, User, UserDocument } from '../models/user.model';
import { Types } from 'mongoose';
import { RegisterUserInput } from '../schemas/user.schema';
import { OrderModel } from '../models/order.model';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async createUser(
    userData: RegisterUserInput,
  ): Promise<Partial<UserDocument> | { error: string }> {
    const { email, phone } = userData;
    if (await this.userRepository.getByEmail(email)) {
      return { error: 'Email is already in use.' };
    }
    if (phone && (await this.userRepository.getByPhone(phone))) {
      return { error: 'Phone number is already in use.' };
    }
    const newUser = await this.userRepository.create({
      ...userData,
      passwordHash: userData.password,
    });
    const userObject = newUser.toObject();
    delete userObject.passwordHash;
    return userObject;
  }

  public async getAll(): Promise<UserDocument[]> {
    return this.userRepository.getAll();
  }

  public async getById(id: string): Promise<UserDocument | null> {
    const user = await this.userRepository.getById(id);
    return user ? user.populate('favorites') : null;
  }

  public async update(
    id: string | Types.ObjectId,
    userData: Partial<User>,
  ): Promise<UserDocument | null> {
    const updatedUser = await this.userRepository.update(id, userData);
    return updatedUser ? updatedUser.populate('favorites') : null;
  }

  public async delete(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return this.userRepository.delete(id);
  }

  public async getUserOrderHistory(userId: string): Promise<any> {
    const orders = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate('restaurantId', 'name slug images')
      .lean();
    return orders;
  }

  public async toggleFavorite(userId: string, restaurantId: string): Promise<UserDocument | null> {
    const user = await this.userRepository.getById(userId);
    if (!user) return null;
    const isFavorite = user.favorites?.some((favId) => favId.toString() === restaurantId);
    if (isFavorite) {
      await this.userRepository.removeFavorite(userId, restaurantId);
    } else {
      await this.userRepository.addFavorite(userId, restaurantId);
    }
    return this.getById(userId);
  }

  public async addAddress(
    userId: string,
    addressData: Omit<Address, '_id'>,
  ): Promise<UserDocument | null> {
    await this.userRepository.addAddress(userId, addressData);
    return this.getById(userId);
  }

  public async updateAddress(
    userId: string,
    addressId: string,
    addressData: Partial<Omit<Address, '_id'>>,
  ): Promise<UserDocument | null> {
    await this.userRepository.updateAddress(userId, addressId, addressData);
    return this.getById(userId);
  }

  public async deleteAddress(userId: string, addressId: string): Promise<UserDocument | null> {
    await this.userRepository.deleteAddress(userId, addressId);
    return this.getById(userId);
  }
}
