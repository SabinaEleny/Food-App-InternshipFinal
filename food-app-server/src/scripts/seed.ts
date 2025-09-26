import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../database';
import { UserModel } from '../models/user.model';
import { CourierModel } from '../models/courier.model';
import { UserRole, VehicleType } from '../utils/enums';

dotenv.config({ path: './.env' });

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database...');

    console.log('🔥 Removing old data...');
    await CourierModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log('✅ Old data removed successfully.');

    const usersToSeed = [
      {
        name: 'Admin FoodApp',
        email: 'admin@foodapp.com',
        passwordHash: 'adminpass123',
        role: UserRole.Admin,
        phone: '0711111111',
        emailVerified: true,
      },
      {
        name: 'Andrei Pop',
        email: 'andrei@test.com',
        passwordHash: 'password123',
        role: UserRole.Customer,
        phone: '0722222222',
        emailVerified: true,
      },
      {
        name: 'Ioana Ionescu',
        email: 'ioana@test.com',
        passwordHash: 'password123',
        role: UserRole.Customer,
        phone: '0733333333',
      },
    ];

    console.log('👤 Creating users one by one to ensure password hashing...');
    const createdUsers = [];
    for (const userData of usersToSeed) {
      const user = await UserModel.create(userData);
      createdUsers.push(user);
    }
    console.log(`✅ ${createdUsers.length} users created.`);

    const couriersToSeed = [
      {
        firstName: 'Gheorghe',
        lastName: 'Rapid',
        phone: '0799111222',
        vehicleType: VehicleType.Motorcycle,
        isAvailable: true,
      },
      {
        firstName: 'Vasile',
        lastName: 'Sprint',
        phone: '0799333444',
        vehicleType: VehicleType.Car,
        isAvailable: false,
      },
      {
        firstName: 'Ion',
        lastName: 'Fulger',
        phone: '0799555666',
        vehicleType: VehicleType.Bicycle,
        isAvailable: true,
      },
    ];

    console.log('🚚 Creating couriers...');
    const createdCouriers = await CourierModel.insertMany(couriersToSeed);
    console.log(`✅ ${createdCouriers.length} couriers created.`);

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
};

seedDatabase();
