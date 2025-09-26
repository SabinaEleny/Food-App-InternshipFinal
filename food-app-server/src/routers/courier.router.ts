import { Response, Router } from 'express';
import { CourierService } from '../services/courier.service';
import { AuthRequest, protect } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createCourierSchema, updateCourierSchema } from '../schemas/courier.schema';
import { UserRole } from '../utils/enums';

export class CourierRouter {
  private service: CourierService;

  constructor(apiRouter: Router) {
    this.service = new CourierService();
    this.initializeRoutes(apiRouter);
  }

  private initializeRoutes(apiRouter: Router): void {
    const courierRouter = Router();

    courierRouter.use(protect());

    courierRouter.get('/', this.getAll.bind(this));
    courierRouter.get('/:id', this.getById.bind(this));

    const adminOnly = protect([UserRole.Admin]);

    courierRouter.post('/', adminOnly, validate(createCourierSchema), this.create.bind(this));
    courierRouter.patch('/:id', adminOnly, validate(updateCourierSchema), this.update.bind(this));
    courierRouter.delete('/:id', adminOnly, this.delete.bind(this));

    apiRouter.use('/couriers', courierRouter);
  }

  public async getAll(req: AuthRequest, res: Response) {
    const couriers = await this.service.getAll();
    res.status(200).json(couriers);
  }

  public async getById(req: AuthRequest, res: Response) {
    const courier = await this.service.getById(req.params.id);
    if (!courier) return res.status(404).json({ message: 'Courier not found.' });
    res.status(200).json(courier);
  }

  public async create(req: AuthRequest, res: Response) {
    const result = await this.service.create(req.body);
    if ('error' in result) return res.status(409).json({ message: result.error });
    res.status(201).json(result);
  }

  public async update(req: AuthRequest, res: Response) {
    const courier = await this.service.update(req.params.id, req.body);
    if (!courier) return res.status(404).json({ message: 'Courier not found.' });
    res.status(200).json(courier);
  }

  public async delete(req: AuthRequest, res: Response) {
    const courier = await this.service.delete(req.params.id);
    if (!courier) return res.status(404).json({ message: 'Courier not found.' });
    res.status(200).json({ message: 'Courier deleted successfully.' });
  }
}
