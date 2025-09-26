import { Request, Response, Router } from 'express';
import { Document } from 'mongoose';
import { BaseServiceType } from '../services/base.service';

export class BaseRouter<T extends Document, TService extends BaseServiceType<T>> {
  public router: Router;
  protected service: TService;
  protected entityName: string;

  constructor(router: Router, service: TService, entityName: string) {
    this.router = router;
    this.service = service;
    this.entityName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    const items = await this.service.getAll(undefined, req.query);
    return res.status(200).json(items);
  }

  public async getById(req: Request, res: Response): Promise<Response> {
    const item = await this.service.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: `${this.entityName} not found` });
    }
    return res.status(200).json(item);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const result = await this.service.create(req.body);

    if (result && typeof result === 'object' && 'error' in result) {
      return res.status(400).json({ message: result.error });
    }
    return res.status(201).json(result);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const item = await this.service.update(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ message: `${this.entityName} not found` });
    }
    return res.status(200).json(item);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const item = await this.service.delete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: `${this.entityName} not found` });
    }
    return res.status(200).json({ message: `${this.entityName} deleted successfully` });
  }
}
