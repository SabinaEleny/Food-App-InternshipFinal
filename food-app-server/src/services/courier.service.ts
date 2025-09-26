import { CourierRepository } from '../repositories/courier.repository';
import { CourierDocument } from '../models/courier.model';
import { CreateCourierInput, UpdateCourierInput } from '../schemas/courier.schema';
import { Types } from 'mongoose';

export class CourierService {
  private readonly courierRepository: CourierRepository;

  constructor() {
    this.courierRepository = new CourierRepository();
  }

  public async getAll(): Promise<CourierDocument[]> {
    return this.courierRepository.getAll();
  }

  public async getById(id: string | Types.ObjectId): Promise<CourierDocument | null> {
    return this.courierRepository.getById(id);
  }

  public async create(data: CreateCourierInput): Promise<CourierDocument | { error: string }> {
    return this.courierRepository.create(data);
  }

  public async update(
    id: string | Types.ObjectId,
    data: UpdateCourierInput,
  ): Promise<CourierDocument | null> {
    return this.courierRepository.update(id, data);
  }

  public async delete(id: string | Types.ObjectId): Promise<CourierDocument | null> {
    return this.courierRepository.delete(id);
  }
}