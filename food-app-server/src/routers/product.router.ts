import { NextFunction, Request, Response, Router } from 'express';
import { ProductService } from '../services/product.service';
import { validate } from '../middlewares/validation';
import {
  AvailabilitySchema,
  CreateProductSchema,
  UpdateProductSchema,
} from '../schemas/product.schema';
import { protect } from '../middlewares/auth';

export class ProductRouter {
  public readonly router = Router();
  private readonly service = new ProductService();

  constructor(api: Router) {
    this.router.use(protect());
    this.router.get('/', this.getAllProducts);
    this.router.get('/allergens', this.getAllergens);
    this.router.get('/:id', this.getProductById);
    this.router.post('/', validate(CreateProductSchema), this.createProduct);
    this.router.patch('/:id', validate(UpdateProductSchema), this.updateProduct);
    this.router.delete('/:id', this.deleteProduct);
    this.router.put('/:id/availability', validate(AvailabilitySchema), this.setProductAvailability);

    api.use('/products', this.router);
  }

  private getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findAll(req.query);
      res.json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve products' });
    }
  };

  private getAllergens = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findAllergens();
      res.json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to retrieve allergens' });
    }
  };

  private getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findById(req.params.id);
      res.json(result);
    } catch (err) {
      return res.status(404).json({ message: 'Product not found' });
    }
  };

  private createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to create product' });
    }
  };

  private updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      return res.status(404).json({ message: 'Product not found or failed to update' });
    }
  };

  private deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.delete(req.params.id);
      res.json(result);
    } catch (err) {
      return res.status(404).json({ message: 'Product not found or failed to delete' });
    }
  };

  private setProductAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.setAvailability(req.params.id, req.body.isAvailable);
      res.json(result);
    } catch (err) {
      return res.status(404).json({ message: 'Product not found or failed to set availability' });
    }
  };
}
