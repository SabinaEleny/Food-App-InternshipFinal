"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourierModel = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../utils/enums");
const CourierSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, index: true },
    vehicleType: {
        type: String,
        enum: Object.values(enums_1.VehicleType),
        required: true,
    },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isAvailable: { type: Boolean, default: true, index: true },
}, {
    timestamps: true,
    versionKey: false,
});
exports.CourierModel = (0, mongoose_1.model)('Courier', CourierSchema);
