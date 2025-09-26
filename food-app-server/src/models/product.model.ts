import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type ProductOptionValue = {
  label: string;
  priceDelta: number;
};

export type ProductOption = {
  name: string;
  required: boolean;
  values: ProductOptionValue[];
};

export type ProductAddOn = {
  label: string;
  price: number;
};

export type Product = {
  restaurantId: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  category: string;
  price: number;
  discountPrice?: number;
  options?: ProductOption[];
  addOns?: ProductAddOn[];
  tags?: string[];
  isAvailable: boolean;
  sortOrder: number;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  allergens?: string[];
};

const ProductOptionValueSchema: Schema = new Schema<ProductOptionValue>({
  label: { type: String, required: true, trim: true },
  priceDelta: { type: Number, required: true },
});

const ProductOptionSchema: Schema = new Schema<ProductOption>({
  name: { type: String, required: true, trim: true },
  required: { type: Boolean, default: false },
  values: { type: [ProductOptionValueSchema], default: [] },
});

const ProductAddOnSchema: Schema = new Schema<ProductAddOn>({
  label: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
});

export type ProductDocument = Product & Document<Types.ObjectId>;

const ProductSchema = new Schema<ProductDocument>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    name: { type: String, required: true, minlength: 2, maxlength: 120, trim: true },
    slug: { type: String, required: true },
    description: { type: String, maxlength: 1000, trim: true },
    images: { type: [String], default: [] },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    options: { type: [ProductOptionSchema], default: [] },
    addOns: { type: [ProductAddOnSchema], default: [] },
    tags: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    archived: { type: Boolean, default: false },
    allergens: { type: [String], default: [] },
  },
  { timestamps: true },
);

ProductSchema.index({ restaurantId: 1, slug: 1 }, { unique: true });

ProductSchema.index({ name: 'text', tags: 'text', description: 'text' });

export const ProductModel: Model<ProductDocument> = mongoose.model<ProductDocument>(
  'Product',
  ProductSchema,
);
