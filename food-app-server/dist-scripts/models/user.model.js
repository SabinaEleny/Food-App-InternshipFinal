"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const enums_1 = require("../utils/enums");
const CardSchema = new mongoose_1.Schema({
    cardType: { type: String, required: true },
    last4Digits: { type: String, required: true, minlength: 4, maxlength: 4 },
    cardHolderName: { type: String, required: true },
    expiryMonth: { type: Number, required: true, min: 1, max: 12 },
    expiryYear: { type: Number, required: true },
});
const AddressSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
}, { timestamps: false, versionKey: false });
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 80, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    phone: { type: String, unique: true, sparse: true, index: true },
    passwordHash: { type: String, select: false },
    role: {
        type: String,
        enum: Object.values(enums_1.UserRole),
        default: enums_1.UserRole.Customer,
    },
    emailVerified: { type: Boolean, default: false },
    avatarUrl: { type: String },
    cards: [CardSchema],
    addresses: [AddressSchema],
    coupons: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Coupon' }],
    favorites: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant' }],
}, {
    timestamps: true,
    versionKey: false,
});
// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash') || !this.passwordHash) {
        return next();
    }
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.passwordHash = await bcryptjs_1.default.hash(this.passwordHash, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Method to compare candidate password with the stored hash
UserSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.passwordHash) {
        return false;
    }
    return await bcryptjs_1.default.compare(candidatePassword, this.passwordHash);
};
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
