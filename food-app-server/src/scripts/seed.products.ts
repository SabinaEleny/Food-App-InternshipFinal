// scripts/seed-products.ts
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../database';
import { ProductModel } from '../models/product.model';
import { RestaurantModel } from '../models/restaurant.model';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base || 'product';
  let i = 1;
  while (true) {
    const exists = await ProductModel.exists({ slug });
    if (!exists) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

async function main() {
  await connectDB();
  console.log('MongoDB connected');
  console.log('Seeding products with dynamic restaurant association...');

  const restaurants = await RestaurantModel.find().limit(2).lean();
  if (restaurants.length === 0) {
    console.error('No restaurants found. Please seed restaurants before seeding products.');
    process.exit(1);
  }

  const restaurantOne = restaurants[0];
  const restaurantTwo = restaurants[1];

  console.log(`Found restaurant 1: "${restaurantOne.name}" (ID: ${restaurantOne._id})`);
  if (restaurantTwo) {
    console.log(`Found restaurant 2: "${restaurantTwo.name}" (ID: ${restaurantTwo._id})`);
  } else {
    console.log('Only one restaurant found.');
  }

  await ProductModel.deleteMany({});
  console.log('Old products removed');

  const productsForRestaurantOne = [
    {
      name: 'Cheeseburger Deluxe',
      description: 'Carne vita 150g si cheddar',
      category: 'Burger',
      price: 1999,
      discountPrice: 1499,
      allergens: ['gluten', 'milk', 'eggs'],
    },
    {
      name: 'Chicken Burger',
      description: 'Piept de pui crocant, salata, sos',
      category: 'Burger',
      price: 1799,
      allergens: ['gluten', 'eggs'],
    },
    {
      name: 'Fries',
      description: 'Cartofi prajiti',
      category: 'Sides',
      price: 699,
      allergens: [''], // exemplu cu string gol
    },
    {
      name: 'Cola',
      description: 'Bautura racoritoare',
      category: 'Drinks',
      price: 599,
      allergens: [], // fără alergeni
    },
  ];

  const productsForRestaurantTwo = [
    {
      name: 'Pizza Margherita',
      description: 'Sos de rosii, mozzarella, busuioc',
      category: 'Pizza',
      price: 2599,
      allergens: ['gluten', 'milk'],
    },
    {
      name: 'Pizza Prosciutto e Funghi',
      description: 'Sos de rosii, mozzarella, prosciutto, ciuperci',
      category: 'Pizza',
      price: 2999,
      allergens: ['gluten', 'milk'],
    },
  ];

  let createdCount = 0;

  const createProductsForRestaurant = async (
    productList: Array<{
      name: string;
      description?: string;
      category: string;
      price: number;
      discountPrice?: number;
      allergens?: string[];
    }>,
    restaurantId: mongoose.Types.ObjectId,
  ) => {
    for (const p of productList) {
      const base = slugify(p.name);
      const slug = await ensureUniqueSlug(base);
      await ProductModel.create({
        ...p,
        slug,
        restaurantId,
        allergens: Array.isArray(p.allergens) ? p.allergens : [],
      });
      createdCount++;
    }
  };

  await createProductsForRestaurant(productsForRestaurantOne, restaurantOne._id);
  console.log(`${productsForRestaurantOne.length} products created for "${restaurantOne.name}".`);

  if (restaurantTwo) {
    await createProductsForRestaurant(productsForRestaurantTwo, restaurantTwo._id);
    console.log(`${productsForRestaurantTwo.length} products created for "${restaurantTwo.name}".`);
  }

  console.log(`\nTotal: ${createdCount} products created.`);
}

main()
  .catch((err) => {
    console.error('Error seeding products:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  });
