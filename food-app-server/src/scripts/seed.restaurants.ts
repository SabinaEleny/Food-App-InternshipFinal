import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../database';
import { RestaurantModel } from '../models/restaurant.model';
import { slugify } from '../utils/slug';

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const exists = await RestaurantModel.exists({ slug });
    if (!exists) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

async function main() {
  await connectDB();
  console.log('Seeding restaurants...');

  await RestaurantModel.deleteMany({});
  console.log('Old restaurants removed');

  const restaurants = [
    {
      name: 'Pizza Palace',
      description: 'The best pizza in town, made with fresh ingredients.',
      images: {
        logoUrl: 'https://picsum.photos/seed/pizzapalace-logo/200/200',
        coverUrl: 'https://picsum.photos/seed/pizzapalace-cover/1200/400',
      },
      phone: '123-456-7890',
      email: 'contact@pizzapalace.com',
      address: '123 Pizza St, Foodville',
      location: { type: 'Point', coordinates: [-74.006, 40.7128] }, // NYC
      openingHours: {
        monday: [{ from: '11:00', to: '22:00' }],
        tuesday: [{ from: '11:00', to: '22:00' }],
        wednesday: [{ from: '11:00', to: '22:00' }],
        thursday: [{ from: '11:00', to: '22:00' }],
        friday: [{ from: '11:00', to: '23:00' }],
        saturday: [{ from: '11:00', to: '23:00' }],
        sunday: [{ from: '12:00', to: '21:00' }],
      },
      status: 'active',
      categories: ['Pizza', 'Italian'],
      tags: ['pizza', 'pasta', 'family friendly'],
      delivery: { minOrder: 15, fee: 3, estimatedMinutes: 45 },
    },
    {
      name: 'Burger Barn',
      description: 'Juicy burgers and crispy fries.',
      images: {
        logoUrl: 'https://picsum.photos/seed/burgerbarn-logo/200/200',
        coverUrl: 'https://picsum.photos/seed/burgerbarn-cover/1200/400',
      },
      phone: '987-654-3210',
      email: 'info@burgerbarn.com',
      address: '456 Burger Ave, Grilltown',
      location: { type: 'Point', coordinates: [-118.2437, 34.0522] }, // LA
      status: 'active',
      categories: ['Burgers', 'Fast Food'],
      tags: ['burgers', 'fries', 'milkshakes'],
      delivery: { minOrder: 10, fee: 2.5, estimatedMinutes: 30 },
    },
    {
      name: 'Sushi Station',
      description: 'Fresh and authentic Japanese sushi.',
      address: '789 Fish Ln, Tokyoville',
      location: { type: 'Point', coordinates: [139.6917, 35.6895] }, // Tokyo
      status: 'inactive',
      categories: ['Sushi', 'Japanese'],
    },
  ];

  for (const r of restaurants) {
    const baseSlug = slugify(r.name);
    const slug = await ensureUniqueSlug(baseSlug);
    await RestaurantModel.create({ ...r, slug });
  }

  console.log(`${restaurants.length} restaurants created`);
}

main()
  .catch((err) => {
    console.error('Error seeding restaurants:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  });
