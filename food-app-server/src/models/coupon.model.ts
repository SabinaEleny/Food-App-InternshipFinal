import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type CouponType = 'percent' | 'fixed';
export type CouponStatus = 'active' | 'inactive' | 'expired';

export type Coupon = {
  code: string;
  type: CouponType;
  value: number;
  restaurantId?: Types.ObjectId | null; // null = global coupon
  minOrderAmount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  validFrom?: Date;
  validUntil?: Date;
  status: CouponStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CouponDocument = Coupon & Document<Types.ObjectId>;

const CouponSchema = new Schema<CouponDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percent', 'fixed'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      default: null,
    },
    minOrderAmount: {
      type: Number,
      min: 0,
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    perUserLimit: {
      type: Number,
      min: 1,
    },
    validFrom: {
      type: Date,
    },
    validUntil: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
  },
  { timestamps: true },
);

CouponSchema.index({ status: 1, restaurantId: 1 });

export const CouponModel: Model<CouponDocument> = mongoose.model<CouponDocument>(
  'Coupon',
  CouponSchema,
);
