import { Document, model, Schema } from 'mongoose';
import { VehicleType } from '../utils/enums';

export type Courier = {
  firstName: string;
  lastName: string;
  phone: string;
  vehicleType: VehicleType;
  rating: number;
  isAvailable: boolean;
};

export type CourierDocument = Courier & Document;

const CourierSchema: Schema<CourierDocument> = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, index: true },
    vehicleType: {
      type: String,
      enum: Object.values(VehicleType),
      required: true,
    },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isAvailable: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CourierModel = model<CourierDocument>('Courier', CourierSchema);
