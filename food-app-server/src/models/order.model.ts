import { Document, model, Schema, Types } from 'mongoose';
import { DeliveryEventStatus, OrderStatus, PaymentStatus } from '../utils/enums';

export type Address = {
  street: string;
  city: string;
  postalCode: string;
  details?: string;
};

export type AddOn = {
  name: string;
  price: number;
};

export type OrderItem = {
  productId: Types.ObjectId;
  name: string;
  category?: string;
  price: number;
  qty: number;
  addOns?: AddOn[];
  notes?: string;
};

export type Amounts = {
  subtotal: number;
  discount?: number;
  deliveryFee: number;
  tax: number;
  total: number;
};

export type Payment = {
  provider: 'stripe' | 'cash';
  intentId?: string;
  chargeId?: string;
  status: PaymentStatus;
};

export type DeliveryEvent = {
  at: Date;
  status: DeliveryEventStatus;
  note?: string;
};

export type Delivery = {
  address: Address;
  etaMinutes?: number;
  courierId?: Types.ObjectId;
  route?: { type: 'LineString'; coordinates: number[][] };
  lastPosition?: { type: 'Point'; coordinates: [number, number] };
  events: DeliveryEvent[];
};

export type Order = {
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  items: OrderItem[];
  amounts: Amounts;
  couponCode?: string;
  payment: Payment;
  status: OrderStatus;
  delivery: Delivery;
};

export type OrderDocument = Order & Document<Types.ObjectId>;

const AddressSchema: Schema<Address> = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    details: { type: String },
  },
  { _id: false },
);

const AddOnSchema: Schema<AddOn> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const OrderItemSchema: Schema<OrderItem> = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    addOns: [AddOnSchema],
    notes: { type: String },
  },
  { _id: false },
);

const AmountsSchema: Schema<Amounts> = new Schema(
  {
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    deliveryFee: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
  },
  { _id: false },
);

const PaymentSchema: Schema<Payment> = new Schema(
  {
    provider: { type: String, required: true, default: 'stripe' },
    intentId: { type: String },
    chargeId: { type: String },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.RequiresPayment,
    },
  },
  { _id: false },
);

const DeliveryEventSchema: Schema<DeliveryEvent> = new Schema(
  {
    at: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: Object.values(DeliveryEventStatus),
      required: true,
    },
    note: { type: String },
  },
  { _id: false },
);

const PointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  { _id: false },
);

const DeliverySchema: Schema<Delivery> = new Schema(
  {
    address: { type: AddressSchema, required: true },
    etaMinutes: { type: Number },
    courierId: { type: Schema.Types.ObjectId, ref: 'Courier' },
    route: { type: Object },
    lastPosition: { type: PointSchema },
    events: [DeliveryEventSchema],
  },
  { _id: false },
);

const OrderSchema: Schema<OrderDocument> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [OrderItemSchema],
    amounts: { type: AmountsSchema, required: true },
    couponCode: { type: String },
    payment: { type: PaymentSchema, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
      index: true,
    },
    delivery: { type: DeliverySchema, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const OrderModel = model<OrderDocument>('Order', OrderSchema);
