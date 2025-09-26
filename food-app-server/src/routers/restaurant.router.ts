import { NextFunction, Request, Response, Router } from 'express';
import { RestaurantService } from '../services/restaurant.service';
import { validate } from '../middlewares/validation';
import { CreateRestaurantSchema, UpdateRestaurantSchema } from '../schemas/restaurant.schema';
import { protect } from '../middlewares/auth';

export class RestaurantRouter {
  public readonly router = Router();
  private readonly service = new RestaurantService();

  constructor(api: Router) {
    this.router.use(protect());
    this.router.get('/', this.getAllRestaurants);
    this.router.get('/categories', this.getUniqueCategories);
    this.router.get('/:id', this.getRestaurantById);
    this.router.post('/', validate(CreateRestaurantSchema), this.createRestaurant);
    this.router.patch('/:id', validate(UpdateRestaurantSchema), this.updateRestaurant);
    this.router.delete('/:id', this.deleteRestaurant);

    api.use('/restaurants', this.router);
  }

  private getAllRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findAll(req.query);
      res.json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve restaurants' });
    }
  };

  private getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findById(req.params.id);
      if (!result) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve restaurant' });
    }
  };

  private getUniqueCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findUniqueCategories();
      res.json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve categories' });
    }
  };

  private createRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to create restaurant' });
    }
  };

  private updateRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to update restaurant' });
    }
  };

  private deleteRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.status(204).send();
    } catch (err) {
      return res.status(500).json({ message: 'Failed to delete restaurant' });
    }
  };
}
