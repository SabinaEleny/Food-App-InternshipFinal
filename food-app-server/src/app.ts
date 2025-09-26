import express, { Application, Router } from 'express';
import config from './config/config';
import { AppError, error } from './middlewares/error';
import { ProductRouter } from './routers/product.router';
import { UserRouter } from './routers/user.router';

import { AuthRouter } from './routers/auth.router';
import { CourierRouter } from './routers/courier.router';
import { CartRouter } from './routers/cart.router';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { RestaurantRouter } from './routers/restaurant.router';
import { CouponRouter } from './routers/coupon.router';
import { OrderRouter } from './routers/order.router';
import { ChatRouter } from './routers/chat.router';
import { AdminRestaurantRouter } from './routers/admin-restaurant.router';
import { AdminProductRouter } from './routers/admin-product.router';

export class App {
  public readonly app: Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = config.port;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }

  private initializeMiddleware(): void {
    this.app.use(
      cors({
        origin: 'http://localhost:5173',
        credentials: true,
      }),
    );
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private initializeRoutes(): void {
    const apiRouter = Router();
    const authRouter = new AuthRouter();

    new UserRouter(apiRouter);
    new CourierRouter(apiRouter);
    new CartRouter(apiRouter);
    new OrderRouter(apiRouter);
    new RestaurantRouter(apiRouter);
    new CouponRouter(apiRouter);
    new ProductRouter(apiRouter);
    new ChatRouter(apiRouter);
    new AdminRestaurantRouter(apiRouter);
    new AdminProductRouter(apiRouter);

    this.app.get('/favicon.ico', (req, res) => res.status(204).send());

    this.app.get('/', (req, res) => {
      res.status(200).json({ message: 'API is ready!' });
    });

    this.app.use('/api/auth', authRouter.router);
    this.app.use('/api', apiRouter);
  }

  private initializeErrorHandling(): void {
    this.app.use((req, res, next) => {
      const error: AppError = new Error(`Not Found - ${req.originalUrl}`);
      error.status = 404;
      next(error);
    });

    this.app.use(error);
  }
}
