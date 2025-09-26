import { Response, Router } from 'express';
import { CartService } from '../services/cart.service';
import { AuthRequest, protect } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { upsertCartItemSchema } from '../schemas/cart.schema';

export class CartRouter {
  private service: CartService;

  constructor(apiRouter: Router) {
    this.service = new CartService();
    this.initializeRoutes(apiRouter);
  }

  public async get(req: AuthRequest, res: Response) {
    const cart = await this.service.getCart(req.user!._id);
    res.status(200).json(cart);
  }

  public async upsertItem(req: AuthRequest, res: Response) {
    const result = await this.service.upsertItem(req.user!._id, req.body);
    if ('error' in result) return res.status(404).json({ message: result.error });
    res.status(200).json(result);
  }

  public async updateItemQuantity(req: AuthRequest, res: Response) {
    const result = await this.service.updateItemQuantity(req.user!._id, req.body);
    res.status(200).json(result);
  }

  public async removeItem(req: AuthRequest, res: Response) {
    const cart = await this.service.removeItem(req.user!._id, req.params.productId);
    res.status(200).json(cart);
  }

  public async clear(req: AuthRequest, res: Response) {
    const cart = await this.service.clearCart(req.user!._id);
    res.status(200).json(cart);
  }

  private initializeRoutes(apiRouter: Router): void {
    const cartRouter = Router();
    cartRouter.use(protect());

    cartRouter.get('/', this.get.bind(this));
    cartRouter.post('/items', validate(upsertCartItemSchema), this.upsertItem.bind(this));
    cartRouter.patch('/items', validate(upsertCartItemSchema), this.updateItemQuantity.bind(this));
    cartRouter.delete('/items/:productId', this.removeItem.bind(this));
    cartRouter.delete('/', this.clear.bind(this));

    apiRouter.use('/cart', cartRouter);
  }
}
