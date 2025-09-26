import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../database'; // Asigură-te că acest path este corect
// Import Models
import { CartModel } from '../models/cart.model';
import { UserModel } from '../models/user.model';
import { RestaurantModel } from '../models/restaurant.model';
import { ProductModel } from '../models/product.model';

async function main() {
  await connectDB();
  console.log('MongoDB connected');
  console.log('Seeding carts...');

  // --- 1. Găsește documentele necesare ---
  // Găsim userii pe baza ID-urilor furnizate
  const userAndrei = await UserModel.findById('68cac8a50e6595282ea1756b').lean();
  const userIoana = await UserModel.findById('68cd66669eb33e77c9351c93').lean();

  // Găsim restaurantul
  const restaurantPizzaPalace = await RestaurantModel.findById('68caa3d97fcf332f37914ba8').lean();

  // Găsim produsele pentru coșul lui Andrei
  const productCheeseburger = await ProductModel.findById('68cd33f9591f2f1e31f1c1a4').lean();
  const productFries = await ProductModel.findById('68cd33f9591f2f1e31f1c1aa').lean();
  const productCola = await ProductModel.findById('68cd33f9591f2f1e31f1c1ad').lean();

  // --- 2. Validare ---
  if (
    !userAndrei ||
    !userIoana ||
    !restaurantPizzaPalace ||
    !productCheeseburger ||
    !productFries ||
    !productCola
  ) {
    console.error('❌ One or more required documents (users, restaurants, products) not found.');
    console.error('Please seed users, restaurants, and products before seeding carts.');
    process.exit(1);
  }

  console.log(`Found user: "${userAndrei.name}"`);
  console.log(`Found user: "${userIoana.name}"`);
  console.log(`Found restaurant: "${restaurantPizzaPalace.name}"`);

  // --- 3. Șterge datele vechi ---
  await CartModel.deleteMany({});
  console.log('🧹 Old carts removed');

  // --- 4. Definește și creează datele noi ---
  const cartsToSeed = [
    // Scenariul 1: Coșul activ al lui Andrei Popa
    {
      userId: userAndrei._id,
      restaurantId: restaurantPizzaPalace._id,
      items: [
        { product: productCheeseburger._id, quantity: 1 },
        { product: productFries._id, quantity: 1 },
        { product: productCola._id, quantity: 2 },
      ],
    },
    // Scenariul 2: Coșul gol al Ioanei Ionescu
    {
      userId: userIoana._id,
      items: [],
    },
  ];

  await CartModel.create(cartsToSeed);
  console.log(`🌱 Total: ${cartsToSeed.length} carts created.`);
}

main()
  .catch((err) => {
    console.error('❌ Error seeding carts:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  });
