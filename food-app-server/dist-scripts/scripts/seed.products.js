"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../database");
const product_model_1 = require("../models/product.model");
const restaurant_model_1 = require("../models/restaurant.model");
function slugify(input) {
    return input
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}
async function ensureUniqueSlug(base) {
    let slug = base;
    if (!slug) {
        slug = 'product';
    }
    let i = 1;
    while (true) {
        const exists = await product_model_1.ProductModel.exists({ slug });
        if (!exists)
            return slug;
        i += 1;
        slug = `${base}-${i}`;
    }
}
async function main() {
    await (0, database_1.connectDB)();
    console.log('MongoDB connected');
    console.log('Seeding products with dynamic restaurant association...');
    const restaurants = await restaurant_model_1.RestaurantModel.find().limit(2).lean();
    if (restaurants.length === 0) {
        console.error('No restaurants found. Please seed restaurants before seeding products.');
        process.exit(1);
    }
    const restaurantOne = restaurants[0];
    const restaurantTwo = restaurants[1];
    console.log(`Found restaurant 1: "${restaurantOne.name}" (ID: ${restaurantOne._id})`);
    if (restaurantTwo) {
        console.log(`Found restaurant 2: "${restaurantTwo.name}" (ID: ${restaurantTwo._id})`);
    }
    else {
        console.log('Only one restaurant found.');
    }
    await product_model_1.ProductModel.deleteMany({});
    console.log('Old products removed');
    const productsForRestaurantOne = [
        {
            name: 'Cheeseburger Deluxe',
            description: 'Carne vita 150g si cheddar',
            category: 'Burgers',
            price: 1999,
            discountPrice: 1499,
        },
        {
            name: 'Chicken Burger',
            description: 'Piept de pui crocant, salata, sos',
            category: 'Burgers',
            price: 1799,
        },
        { name: 'Fries', description: 'Cartofi prajiti', category: 'Sides', price: 699 },
        // Am mutat "Cola" aici, pentru a respecta regula "required: true"
        { name: 'Cola', description: 'Bautura racoritoare', category: 'Drinks', price: 599 },
    ];
    const productsForRestaurantTwo = [
        {
            name: 'Pizza Margherita',
            description: 'Sos de rosii, mozzarella, busuioc',
            category: 'Pizza',
            price: 2599,
        },
        {
            name: 'Pizza Prosciutto e Funghi',
            description: 'Sos de rosii, mozzarella, prosciutto, ciuperci',
            category: 'Pizza',
            price: 2999,
        },
    ];
    let createdCount = 0;
    const createProductsForRestaurant = async (productList, restaurantId) => {
        for (const p of productList) {
            const base = slugify(p.name);
            const slug = await ensureUniqueSlug(base);
            await product_model_1.ProductModel.create({ ...p, slug, restaurantId: restaurantId });
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
    await mongoose_1.default.disconnect();
    console.log('Disconnected from MongoDB');
});
