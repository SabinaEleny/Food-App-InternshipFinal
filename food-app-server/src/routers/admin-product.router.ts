import { Request, Response, Router } from 'express';
import { ProductService } from '../services/product.service';
import { protect } from '../middlewares/auth';
import { UserRole } from '../utils/enums';

export class AdminProductRouter {
  private productService: ProductService;

  constructor(apiRouter: Router) {
    this.productService = new ProductService();
    this.initializeRoutes(apiRouter);
  }

  private initializeRoutes(apiRouter: Router): void {
    const adminProductRouter = Router();

    adminProductRouter.use(protect([UserRole.Admin]));

    adminProductRouter.put('/:id', this.updateProduct.bind(this));
    adminProductRouter.delete('/:id', this.deleteProduct.bind(this));

    apiRouter.use('/admin/products', adminProductRouter);
  }

  public async updateProduct(req: Request, res: Response) {
    try {
      const updatedProduct = await this.productService.update(req.params.id, req.body);
      res.status(200).json(updatedProduct);
    } catch (error: any) {
      console.error('[AdminProductRouter] Update error:', error);
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Internal Server Error' });
    }
  }

  public async deleteProduct(req: Request, res: Response) {
    try {
      const deleted = await this.productService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('[AdminProductRouter] Delete error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
