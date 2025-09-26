import { NextFunction, Response, Router } from 'express';
import { validate } from '../middlewares/validation';
import { createOrderSchema } from '../schemas/order.schema';
import { OrderService } from '../services/order.service';
import { AuthRequest, protect } from '../middlewares/auth';

export class OrderRouter {
  public readonly router = Router();
  private readonly service = new OrderService();

  constructor(api: Router) {
    this.router.use(protect());

    this.router.post('/create-payment-intent', this.createPaymentIntent);
    this.router.post('/', validate(createOrderSchema), this.createOrder);
    this.router.get('/', this.getAllOrders);
    this.router.get('/:id', this.getOrderById);
    this.router.delete('/:id', this.deleteOrder);

    api.use('/orders', this.router);
  }

  private createPaymentIntent = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!._id.toString();
      const result = await this.service.createPaymentIntent(userId, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Failed to create payment intent' });
    }
  };

  private createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!._id.toString();
      const result = await this.service.create(userId, req.body);
      res.status(201).json(result);
    } catch (err: any) {
      next(err);
    }
  };

  private getAllOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!._id.toString();

      const { status, restaurantId } = req.query;

      const filters: any = { userId };
      if (status) filters.status = status;
      if (restaurantId) filters.restaurantId = restaurantId;

      const results = await this.service.findAll(filters);
      res.json(results);
    } catch (err) {
      next(err);
    }
  };

  private getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!._id.toString();
      const orderId = req.params.id;
      const result = await this.service.findById(userId, orderId);
      if (!result) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  private deleteOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!._id.toString();
      const orderId = req.params.id;
      await this.service.delete(userId, orderId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
