import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../database';
// Import Models & Enums
import { OrderModel } from '../models/order.model';
import { UserModel } from '../models/user.model';
import { RestaurantModel } from '../models/restaurant.model';
import { DeliveryEventStatus, OrderStatus, PaymentStatus } from '../utils/enums';

const dateInPast = (days: number, hours = 0, minutes = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  date.setMinutes(date.getMinutes() - minutes);
  return date;
};

async function main() {
  await connectDB();
  console.log('MongoDB connected');
  console.log('Seeding orders...');

  const userJohnny = await UserModel.findById('68cd6d63228e8f0abb703738').lean();
  const userAndrei = await UserModel.findById('68cac8a50e6595282ea1756b').lean();

  const restaurantBurgerBarn = await RestaurantModel.findById('68caa3d97fcf332f37914bab').lean();
  const restaurantPizzaPalace = await RestaurantModel.findById('68caa3d97fcf332f37914ba8').lean();

  if (!userJohnny || !userAndrei || !restaurantBurgerBarn || !restaurantPizzaPalace) {
    console.error('❌ One or more required documents (users, restaurants) not found.');
    console.error('Please seed users and restaurants before seeding orders.');
    process.exit(1);
  }

  console.log(`Found user: "${userJohnny.name}"`);
  console.log(`Found user: "${userAndrei.name}"`);
  console.log(`Found restaurant: "${restaurantBurgerBarn.name}"`);
  console.log(`Found restaurant: "${restaurantPizzaPalace.name}"`);

  await OrderModel.deleteMany({});
  console.log('🧹 Old orders removed');

  const ordersToSeed = [
    {
      userId: userJohnny._id,
      restaurantId: restaurantBurgerBarn._id,
      items: [
        {
          productId: new mongoose.Types.ObjectId('68cd33fa591f2f1e31f1c1b0'),
          name: 'Pizza Margherita',
          price: 2599,
          qty: 1,
        },
        {
          productId: new mongoose.Types.ObjectId('68cd33fa591f2f1e31f1c1b3'),
          name: 'Pizza Prosciutto e Funghi',
          price: 2999,
          qty: 1,
        },
      ],
      amounts: { subtotal: 5598, discount: 0, deliveryFee: 500, tax: 504, total: 6602 },
      payment: { provider: 'stripe', status: PaymentStatus.Paid },
      status: OrderStatus.Delivered,
      delivery: {
        address: { street: 'Strada Fictivă Nr. 10', city: 'București', postalCode: '010101' },
        events: [
          { status: DeliveryEventStatus.OrderPlaced, at: dateInPast(2, 1, 30) },
          { status: DeliveryEventStatus.RestaurantAccepted, at: dateInPast(2, 1, 28) },
          { status: DeliveryEventStatus.DriverAssigned, at: dateInPast(2, 1, 15) },
          { status: DeliveryEventStatus.OrderPickedUp, at: dateInPast(2, 0, 50) },
          { status: DeliveryEventStatus.OrderDelivered, at: dateInPast(2, 0, 25) },
        ],
      },
    },

    {
      userId: userAndrei._id,
      restaurantId: restaurantPizzaPalace._id,
      items: [
        {
          productId: new mongoose.Types.ObjectId('68cd33f9591f2f1e31f1c1a7'),
          name: 'Chicken Burger',
          price: 1799,
          qty: 2,
        },
      ],
      amounts: { subtotal: 3598, discount: 0, deliveryFee: 500, tax: 324, total: 4422 },
      payment: { provider: 'stripe', status: PaymentStatus.Paid },
      status: OrderStatus.Accepted,
      delivery: {
        address: { street: 'Bulevardul Testelor Nr. 42', city: 'București', postalCode: '030303' },
        events: [
          { status: DeliveryEventStatus.OrderPlaced, at: dateInPast(0, 0, 45) },
          { status: DeliveryEventStatus.RestaurantAccepted, at: dateInPast(0, 0, 43) },
        ],
      },
    },
  ];

  await OrderModel.create(ordersToSeed);
  console.log(`🌱 Total: ${ordersToSeed.length} orders created.`);
}

main()
  .catch((err) => {
    console.error('❌ Error seeding orders:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  });
