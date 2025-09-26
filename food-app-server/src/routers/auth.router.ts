import { Request, Response, Router } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginUserInput, RegisterUserInput } from '../schemas/user.schema';

export class AuthRouter {
  public router: Router;
  private authService: AuthService;

  constructor() {
    this.router = Router();
    this.authService = new AuthService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', this.login.bind(this));
    this.router.get('/logout', this.logout.bind(this));

    this.router.post('/verify-email', this.handleVerifyEmail.bind(this));
  }

  public async register(req: Request<{}, {}, RegisterUserInput>, res: Response) {
    try {
      const result = await this.authService.register(req.body);

      if ('error' in result) {
        return res.status(409).json({ message: result.error });
      }

      res.status(201).json({ user: result });
    } catch (error) {
      console.error('[AuthRouter] Register error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async login(req: Request<{}, {}, LoginUserInput>, res: Response) {
    try {
      const result = await this.authService.login(req.body);

      if ('error' in result) {
        return res.status(401).json({ message: result.error });
      }

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ user: result.user });
    } catch (error) {
      console.error('[AuthRouter] Login error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public logout(req: Request, res: Response) {
    try {
      res.clearCookie('token');
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('[AuthRouter] Logout error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async handleVerifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: 'Token is required.' });
      }

      const result = await this.authService.verifyEmail(token);

      if ('error' in result) {
        return res.status(400).json({ message: result.error });
      }

      res.status(200).json({ message: result.message });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
