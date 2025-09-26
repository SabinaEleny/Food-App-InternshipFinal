import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../database';
import { CouponModel } from '../models/coupon.model';
import { RestaurantModel } from '../models/restaurant.model'; // Optional, to get a real restaurantId

async function main() {
  await connectDB();
  console.log('Seeding coupons...');

  await CouponModel.deleteMany({});
  console.log('Old coupons removed');

  // Optional: Find a real restaurant to link a coupon to it
  const firstRestaurant = await RestaurantModel.findOne().lean();
  const restaurantId = firstRestaurant ? firstRestaurant._id : null;

  const coupons = [
    {
      code: 'WELCOME15',
      type: 'percent',
      value: 15, // 15% discount
      minOrderAmount: 5000, // 50 RON
      status: 'active',
      restaurantId: null, // Global coupon
      description: '15% discount for new customers on orders over 50 RON.',
    },
    {
      code: 'PIZZA5',
      type: 'fixed',
      value: 500, // 5 RON discount
      status: 'active',
      restaurantId: restaurantId,
      usageLimit: 200,
      description: '5 RON discount for any order at a specific pizza place.',
    },
    {
      code: 'EXPIRED20',
      type: 'percent',
      value: 20,
      status: 'expired',
      validUntil: new Date(new Date().setDate(new Date().getDate() - 1)), // Expired yesterday
      description: 'An expired coupon for testing purposes.',
    },
    {
      code: 'INACTIVE50',
      type: 'fixed',
      value: 5000, // 50 RON
      status: 'inactive',
      description: 'A valid but manually disabled coupon.',
    },
    {
      code: 'BLACKFRIDAY',
      type: 'percent',
      value: 30,
      status: 'active',
      validFrom: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Becomes valid next month
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1, 3)), // Valid for 3 days
      description: 'A future coupon for a special event.',
    },
    {
      code: 'LIMITED100',
      type: 'fixed',
      value: 1000, // 10 RON
      status: 'active',
      usageLimit: 100,
      usageCount: 98, // Almost used up
      perUserLimit: 1,
      description: 'A limited-use coupon, almost exhausted.',
    },
  ];

  let created = 0;
  for (const couponData of coupons) {
    // A simple check to not create restaurant-specific coupons if no restaurant was found
    if (couponData.restaurantId === null && couponData.code === 'PIZZA5') {
      console.log('Skipping PIZZA5 coupon because no restaurant was found in the database.');
      continue;
    }
    await CouponModel.create(couponData);
    created += 1;
  }

  console.log(`${created} coupons created`);
}

main()
  .catch((err) => {
    console.error('Error seeding coupons:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  });
