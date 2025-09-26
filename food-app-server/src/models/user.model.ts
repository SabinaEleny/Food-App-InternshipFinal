import { Document, model, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../utils/enums';

export type Card = {
  _id?: Types.ObjectId;
  cardType: string;
  last4Digits: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
};

export type Address = {
  _id?: Types.ObjectId;
  title: string; // "Home", "Office"
  street: string;
  city: string;
};

export type User = {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  role: UserRole;
  emailVerified: boolean;
  avatarUrl?: string;
  cards: Card[];
  addresses: Address[];
  coupons: Types.ObjectId[];
  favorites: Types.ObjectId[];
};

export type UserDocument = User &
  Document<Types.ObjectId> & {
    comparePassword(candidatePassword: string): Promise<boolean>;
  };

const CardSchema: Schema<Card> = new Schema({
  cardType: { type: String, required: true },
  last4Digits: { type: String, required: true, minlength: 4, maxlength: 4 },
  cardHolderName: { type: String, required: true },
  expiryMonth: { type: Number, required: true, min: 1, max: 12 },
  expiryYear: { type: Number, required: true },
});

const AddressSchema: Schema<Address> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
  },
  { timestamps: false, versionKey: false },
);

const UserSchema: Schema<UserDocument> = new Schema(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 80, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    phone: { type: String, unique: true, sparse: true, index: true },
    passwordHash: { type: String, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Customer,
    },
    emailVerified: { type: Boolean, default: false },
    avatarUrl: { type: String },
    cards: [CardSchema],
    addresses: [AddressSchema],
    coupons: [{ type: Schema.Types.ObjectId, ref: 'Coupon' }],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare candidate password with the stored hash
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.passwordHash) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

export const UserModel = model<UserDocument>('User', UserSchema);
