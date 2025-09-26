import { FilterQuery } from 'mongoose';
import { CouponRepository } from '../repositories/coupon.repository';
import { CouponDocument } from '../models/coupon.model';

export interface IGetAllCouponsQuery {
  page?: string;
  limit?: string;
  status?: 'active' | 'inactive' | 'expired';
  restaurantId?: string;
}

export class CouponService {
  private readonly couponRepository: CouponRepository;

  constructor() {
    this.couponRepository = new CouponRepository();
  }

  public async findAll(queryParams: IGetAllCouponsQuery): Promise<{
    coupons: CouponDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = queryParams.page ? parseInt(queryParams.page, 10) : 1;
    const limit = queryParams.limit ? parseInt(queryParams.limit, 10) : 10;

    const query: FilterQuery<CouponDocument> = {};
    if (queryParams.status) {
      query.status = queryParams.status;
    }
    if (queryParams.restaurantId) {
      query.restaurantId = queryParams.restaurantId;
    }

    const { coupons, total } = await this.couponRepository.findAll(query, page, limit);
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

    return { coupons, total, page, totalPages };
  }

  public async create(input: any): Promise<CouponDocument> {
    try {
      const coupon = await this.couponRepository.create(input);
      return coupon;
    } catch (err: any) {
      if (err.code === 11000) {
        ///11000 is mongodb duplicate key error
        throw Object.assign(new Error('Coupon code already exists'), { status: 409 });
      }
      throw err;
    }
  }

  public async findById(id: string): Promise<CouponDocument | undefined> {
    return (await this.couponRepository.findById(id)) ?? undefined;
  }

  public async update(id: string, input: any): Promise<CouponDocument> {
    const updated = await this.couponRepository.update(id, input);
    if (!updated) {
      throw Object.assign(new Error('Coupon not found'), { status: 404 });
    }
    return updated;
  }

  // Sets the coupon status to 'inactive'
  public async softDelete(id: string): Promise<CouponDocument> {
    const updated = await this.couponRepository.update(id, { status: 'inactive' });
    if (!updated) {
      throw Object.assign(new Error('Coupon not found'), { status: 404 });
    }
    return updated;
  }

  // Permanently removes the coupon from the database
  public async hardDelete(id: string): Promise<CouponDocument | undefined> {
    return (await this.couponRepository.delete(id)) ?? undefined;
  }

  public async validateCouponForCart(code: string, cartAmount: number, restaurantId: string) {
    const coupon = await this.couponRepository.findByCode(code);

    if (!coupon) throw new Error('Coupon not found');
    if (coupon.status !== 'active') throw new Error('Coupon is not active');

    const now = new Date();
    if (coupon.validFrom && coupon.validFrom > now) throw new Error('Coupon is not yet valid');
    if (coupon.validUntil && coupon.validUntil < now) throw new Error('Coupon has expired');

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit)
      throw new Error('Coupon has reached its usage limit');
    if (coupon.minOrderAmount && cartAmount < coupon.minOrderAmount)
      throw new Error(`Minimum order amount is ${coupon.minOrderAmount}`);
    if (coupon.restaurantId && coupon.restaurantId.toString() !== restaurantId)
      throw new Error('Coupon is not valid for this restaurant');

    return coupon;
  }
}
