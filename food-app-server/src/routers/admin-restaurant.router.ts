import { Request, Response, Router } from 'express';
import { RestaurantService } from '../services/restaurant.service';
import { protect } from '../middlewares/auth';
import { UserRole } from '../utils/enums';
import { ProductService } from '../services/product.service';

export class AdminRestaurantRouter {
  private restaurantService: RestaurantService;
  private productService: ProductService;

  constructor(apiRouter: Router) {
    this.restaurantService = new RestaurantService();
    this.productService = new ProductService();
    this.initializeRoutes(apiRouter);
  }

  private initializeRoutes(apiRouter: Router): void {
    const adminRouter = Router();

    adminRouter.use(protect([UserRole.Admin]));

    adminRouter.get('/', this.getAllRestaurants.bind(this));
    adminRouter.post('/', this.createRestaurant.bind(this));
    adminRouter.put('/:id', this.updateRestaurant.bind(this));
    adminRouter.delete('/:id', this.deleteRestaurant.bind(this));

    adminRouter.get('/:id/products', this.getProducts.bind(this));
    adminRouter.post('/:id/products', this.createProduct.bind(this));
    apiRouter.use('/admin/restaurants', adminRouter);
  }

  public async getAllRestaurants(req: Request, res: Response) {
    try {
      const restaurants = await this.restaurantService.findAllAdmin();
      res.status(200).json(restaurants);
    } catch (error) {
      console.error('[AdminRestaurantRouter] GetAll error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async createRestaurant(req: Request, res: Response) {
    try {
      const newRestaurant = await this.restaurantService.create(req.body);
      res.status(201).json(newRestaurant);
    } catch (error) {
      console.error('[AdminRestaurantRouter] Create error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async updateRestaurant(req: Request, res: Response) {
    try {
      const updated = await this.restaurantService.update(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error: any) {
      console.error('[AdminRestaurantRouter] Update error:', error);
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Internal Server Error' });
    }
  }

  public async deleteRestaurant(req: Request, res: Response) {
    try {
      const deleted = await this.restaurantService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Restaurant not found.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('[AdminRestaurantRouter] Delete error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async getProducts(req: Request, res: Response) {
    try {
      const products = await this.restaurantService.findProductsByRestaurant(req.params.id);
      res.status(200).json(products);
    } catch (error) {
      console.error('[AdminRestaurantRouter] GetProducts error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async createProduct(req: Request, res: Response) {
    try {
      const productInput = { ...req.body, restaurantId: req.params.id };

      const newProduct = await this.productService.create(productInput);
      res.status(201).json(newProduct);
    } catch (error: any) {
      console.error('[AdminRestaurantRouter] CreateProduct error:', error);
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Internal Server Error' });
    }
  }
}
