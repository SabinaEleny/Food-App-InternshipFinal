import { Request, Response, Router } from 'express';
import { CouponService } from '../services/coupon.service';
import { validate } from '../middlewares/validation';
import { CreateCouponSchema, UpdateCouponSchema } from '../schemas/coupon.schema';

export class CouponRouter {
  public readonly router = Router();
  private readonly service = new CouponService();

  constructor(api: Router) {
    this.router.get('/', this.getAllCoupons);
    this.router.post('/', validate(CreateCouponSchema), this.createCoupon);
    this.router.patch('/:id', validate(UpdateCouponSchema), this.updateCoupon);
    this.router.delete('/:id', this.softDeleteCoupon);
    this.router.delete('/:id/hard', this.hardDeleteCoupon);

    api.use('/coupons', this.router);
  }

  private getAllCoupons = async (req: Request, res: Response) => {
    try {
      const result = await this.service.findAll(req.query);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: 'Failed to retrieve coupons' });
    }
  };

  private createCoupon = async (req: Request, res: Response) => {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      const status = err.status || 500;
      res.status(status).json({ message: err.message || 'Failed to create coupon' });
    }
  };

  private updateCoupon = async (req: Request, res: Response) => {
    try {
      const result = await this.service.update(req.params.id, req.body);
      res.json(result);
    } catch (err: any) {
      const status = err.status || 500;
      res.status(status).json({ message: err.message || 'Failed to update coupon' });
    }
  };

  private softDeleteCoupon = async (req: Request, res: Response) => {
    try {
      await this.service.softDelete(req.params.id);
      res.status(204).send(); // Success, no content to return
    } catch (err: any) {
      const status = err.status || 500;
      res.status(status).json({ message: err.message || 'Failed to delete coupon' });
    }
  };

  private hardDeleteCoupon = async (req: Request, res: Response) => {
    try {
      const result = await this.service.hardDelete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to permanently delete coupon' });
    }
  };
}
