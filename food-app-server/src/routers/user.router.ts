import { NextFunction, Request, Response, Router } from 'express';
import { UserService } from '../services/user.service';
import { AuthRequest, protect } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { registerUserSchema, updateUserProfileSchema } from '../schemas/user.schema';
import { UserRole } from '../utils/enums';

export class UserRouter {
  private userService: UserService;

  constructor(apiRouter: Router) {
    this.userService = new UserService();
    this.initializeRoutes(apiRouter);
  }

  private initializeRoutes(apiRouter: Router): void {
    const userRouter = Router();

    userRouter.use(protect());

    userRouter.get('/me', this.getCurrentUser.bind(this));
    userRouter.patch('/me', validate(updateUserProfileSchema), this.updateCurrentUser.bind(this));
    userRouter.get('/:id/orders', this.checkUserAccess.bind(this), this.getUserOrders.bind(this));

    userRouter.post('/me/addresses', this.addAddress.bind(this));
    userRouter.patch('/me/addresses/:addressId', this.updateAddress.bind(this));
    userRouter.delete('/me/addresses/:addressId', this.deleteAddress.bind(this));

    userRouter.post('/me/favorites/toggle', this.toggleFavorite.bind(this));

    userRouter.get('/', protect([UserRole.Admin]), this.getAllUsers.bind(this));
    userRouter.get('/:id', protect([UserRole.Admin]), this.getUserById.bind(this));
    userRouter.post(
      '/',
      protect([UserRole.Admin]),
      validate(registerUserSchema),
      this.createUser.bind(this),
    );
    userRouter.patch('/:id', protect([UserRole.Admin]), this.updateUserById.bind(this));
    userRouter.delete('/:id', protect([UserRole.Admin]), this.deleteUserById.bind(this));

    apiRouter.use('/users', userRouter);
  }

  private checkUserAccess(req: AuthRequest, res: Response, next: NextFunction) {
    const loggedInUser = req.user!;
    const targetUserId = req.params.id;
    if (loggedInUser.role === UserRole.Admin || loggedInUser._id.toString() === targetUserId) {
      return next();
    }
    return res
      .status(403)
      .json({ message: 'Forbidden: You do not have permission to access this resource.' });
  }

  public async getCurrentUser(req: AuthRequest, res: Response) {
    const user = await this.userService.getById(req.user!._id.toString());
    res.status(200).json({ user });
  }

  public async updateCurrentUser(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!._id;
      const updatedUser = await this.userService.update(userId, req.body);
      if (!updatedUser) return res.status(404).json({ message: 'User not found.' });
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error('[UserRouter] Update error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async getUserOrders(req: AuthRequest, res: Response) {
    try {
      const targetUserId = req.params.id;
      const orders = await this.userService.getUserOrderHistory(targetUserId);
      res.status(200).json(orders);
    } catch (error) {
      console.error('[UserRouter] Get User Orders error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async toggleFavorite(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!._id.toString();
      const { restaurantId } = req.body;

      if (!restaurantId) {
        return res.status(400).json({ message: 'Restaurant ID is required.' });
      }

      const updatedUser = await this.userService.toggleFavorite(userId, restaurantId);

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error('[UserRouter] Toggle Favorite error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      console.error('[UserRouter] GetAllUsers error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async updateUserById(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.id;
      const updatedUser = await this.userService.update(userId, req.body);
      if (!updatedUser) return res.status(404).json({ message: 'User not found.' });
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error('[UserRouter] UpdateUserById error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async deleteUserById(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.id;
      const deletedUser = await this.userService.delete(userId);
      if (!deletedUser) return res.status(404).json({ message: 'User not found.' });
      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      console.error('[UserRouter] DeleteUserById error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async getUserById(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.id;
      const user = await this.userService.getById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('[UserRouter] GetUserById error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async createUser(req: AuthRequest, res: Response) {
    try {
      const result = await this.userService.createUser(req.body);

      if ('error' in result) {
        return res.status(409).json({ message: result.error });
      }

      res.status(201).json({ user: result });
    } catch (error) {
      console.error('[UserRouter] CreateUser error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async addAddress(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!._id.toString();
      const updatedUser = await this.userService.addAddress(userId, req.body);
      res.status(201).json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async updateAddress(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!._id.toString();
      const { addressId } = req.params;
      const updatedUser = await this.userService.updateAddress(userId, addressId, req.body);
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async deleteAddress(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!._id.toString();
      const { addressId } = req.params;
      const updatedUser = await this.userService.deleteAddress(userId, addressId);
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
