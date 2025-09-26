import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type OpeningHours = {
  from: string;
  to: string;
};

export type Delivery = {
  minOrder?: number;
  fee?: number;
  estimatedMinutes?: number;
};

export type Restaurant = {
  name: string;
  slug: string;
  description?: string;
  images: {
    logoUrl?: string;
    coverUrl?: string;
  };
  phone?: string;
  email?: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  openingHours: Map<string, OpeningHours[]>;
  status: 'draft' | 'active' | 'inactive';
  categories: string[];
  tags?: string[];
  delivery?: Delivery;
  ownerUserId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type RestaurantDocument = Restaurant & Document<Types.ObjectId>;

const OpeningHoursSchema = new Schema<OpeningHours>(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { _id: false },
);

const DeliverySchema = new Schema<Delivery>(
  {
    minOrder: { type: Number, min: 0 },
    fee: { type: Number, min: 0 },
    estimatedMinutes: { type: Number, min: 0 },
  },
  { _id: false },
);

const RestaurantSchema = new Schema<RestaurantDocument>(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 120, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, maxlength: 1000, trim: true },
    images: {
      logoUrl: { type: String },
      coverUrl: { type: String },
    },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    openingHours: {
      type: Map,
      of: [OpeningHoursSchema],
    },
    status: { type: String, enum: ['draft', 'active', 'inactive'], default: 'draft' },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    delivery: DeliverySchema,
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

RestaurantSchema.index({ location: '2dsphere' });
RestaurantSchema.index({ name: 'text', description: 'text', tags: 'text', categories: 'text' });

export const RestaurantModel: Model<RestaurantDocument> = mongoose.model<RestaurantDocument>(
  'Restaurant',
  RestaurantSchema,
);
