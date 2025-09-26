"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../database");
const user_model_1 = require("../models/user.model");
const courier_model_1 = require("../models/courier.model");
const enums_1 = require("../utils/enums");
dotenv_1.default.config({ path: './.env' });
const seedDatabase = async () => {
    try {
        await (0, database_1.connectDB)();
        console.log('🌱 Seeding database...');
        console.log('🔥 Removing old data...');
        await courier_model_1.CourierModel.deleteMany({});
        await user_model_1.UserModel.deleteMany({});
        console.log('✅ Old data removed successfully.');
        const usersToSeed = [
            {
                name: 'Admin FoodApp',
                email: 'admin@foodapp.com',
                passwordHash: 'adminpass123',
                role: enums_1.UserRole.Admin,
                phone: '0711111111',
                emailVerified: true,
            },
            {
                name: 'Andrei Pop',
                email: 'andrei@test.com',
                passwordHash: 'password123',
                role: enums_1.UserRole.Customer,
                phone: '0722222222',
                emailVerified: true,
            },
            {
                name: 'Ioana Ionescu',
                email: 'ioana@test.com',
                passwordHash: 'password123',
                role: enums_1.UserRole.Customer,
                phone: '0733333333',
            },
        ];
        console.log('👤 Creating users one by one to ensure password hashing...');
        const createdUsers = [];
        for (const userData of usersToSeed) {
            const user = await user_model_1.UserModel.create(userData);
            createdUsers.push(user);
        }
        console.log(`✅ ${createdUsers.length} users created.`);
        const couriersToSeed = [
            {
                firstName: 'Gheorghe',
                lastName: 'Rapid',
                phone: '0799111222',
                vehicleType: enums_1.VehicleType.Motorcycle,
                isAvailable: true,
            },
            {
                firstName: 'Vasile',
                lastName: 'Sprint',
                phone: '0799333444',
                vehicleType: enums_1.VehicleType.Car,
                isAvailable: false,
            },
            {
                firstName: 'Ion',
                lastName: 'Fulger',
                phone: '0799555666',
                vehicleType: enums_1.VehicleType.Bicycle,
                isAvailable: true,
            },
        ];
        console.log('🚚 Creating couriers...');
        const createdCouriers = await courier_model_1.CourierModel.insertMany(couriersToSeed);
        console.log(`✅ ${createdCouriers.length} couriers created.`);
        console.log('🎉 Database seeded successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('🔌 Disconnected from MongoDB.');
    }
};
seedDatabase();
