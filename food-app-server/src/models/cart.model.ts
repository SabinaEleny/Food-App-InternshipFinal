import { Document, model, Schema, Types } from 'mongoose';

export type CartItem = {
  product: Types.ObjectId;
  quantity: number;
};

export type Cart = {
  userId: Types.ObjectId;
  restaurantId?: Types.ObjectId;
  items: CartItem[];
  total: number;
  discounts: number;
  deliveryFee: number;
};

export type CartDocument = Cart & Document<Types.ObjectId>;

const CartItemSchema: Schema<CartItem> = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  {
    _id: false,
  },
);

const CartSchema: Schema<CartDocument> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: false },
    items: [CartItemSchema],
    total: { type: Number, required: true, default: 0 },
    discounts: { type: Number, required: true, default: 0 },
    deliveryFee: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CartModel = model<CartDocument>('Cart', CartSchema);
