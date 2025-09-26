"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OpeningHoursSchema = new mongoose_1.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
}, { _id: false });
const DeliverySchema = new mongoose_1.Schema({
    minOrder: { type: Number, min: 0 },
    fee: { type: Number, min: 0 },
    estimatedMinutes: { type: Number, min: 0 },
}, { _id: false });
const RestaurantSchema = new mongoose_1.Schema({
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
    ownerUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
RestaurantSchema.index({ location: '2dsphere' });
RestaurantSchema.index({ name: 'text', description: 'text', tags: 'text', categories: 'text' });
exports.RestaurantModel = mongoose_1.default.model('Restaurant', RestaurantSchema);
