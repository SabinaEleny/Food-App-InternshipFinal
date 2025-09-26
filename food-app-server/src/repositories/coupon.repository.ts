import { FilterQuery } from 'mongoose';
import { Coupon, CouponDocument, CouponModel } from '../models/coupon.model';

export class CouponRepository {
  public async findAll(
    query: FilterQuery<CouponDocument>,
    page: number,
    limit: number,
  ): Promise<{ coupons: CouponDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const coupons = await CouponModel.find(query).skip(skip).limit(limit).lean();
    const total = await CouponModel.countDocuments(query);
    return { coupons, total };
  }

  public async create(data: Partial<Coupon>): Promise<CouponDocument> {
    const doc = await CouponModel.create(data);
    return doc.toObject();
  }

  public async findById(id: string): Promise<CouponDocument | null> {
    return CouponModel.findById(id).lean();
  }

  public async findByCode(code: string): Promise<CouponDocument | null> {
    return CouponModel.findOne({ code: code.toUpperCase() }).lean();
  }

  public async update(id: string, update: Partial<Coupon>): Promise<CouponDocument | null> {
    return CouponModel.findByIdAndUpdate(id, update, { new: true }).lean();
  }

  public async delete(id: string): Promise<CouponDocument | null> {
    return CouponModel.findByIdAndDelete(id);
  }

  public async incrementUsage(id: string): Promise<void> {
    await CouponModel.updateOne({ _id: id }, { $inc: { usageCount: 1 } });
  }
}
