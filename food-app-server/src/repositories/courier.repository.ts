import { Courier, CourierDocument, CourierModel } from '../models/courier.model';
import { Types } from 'mongoose';

export class CourierRepository {
  public async getAll(): Promise<CourierDocument[]> {
    return CourierModel.find({});
  }

  public async getById(id: string | Types.ObjectId): Promise<CourierDocument | null> {
    return CourierModel.findById(id);
  }

  public async create(courierData: Partial<Courier>): Promise<CourierDocument> {
    return CourierModel.create(courierData);
  }

  public async update(
    id: string | Types.ObjectId,
    courierData: Partial<Courier>,
  ): Promise<CourierDocument | null> {
    return CourierModel.findByIdAndUpdate(id, courierData, { new: true });
  }

  public async delete(id: string | Types.ObjectId): Promise<CourierDocument | null> {
    return CourierModel.findByIdAndDelete(id);
  }
}
