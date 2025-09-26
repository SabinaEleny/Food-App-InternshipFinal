import burgerImage from "../resources/images/restaurant-page/burger-image.jpg";
import coverImage from "../resources/images/restaurant-page/cover-image.jpg";

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    allergens: string[];
    imageUrl: string;
};

export const mockRestaurantInfo = {
    name: "McDonald's Mihai Viteazu",
    slogan: "i'm lovin' it",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/2389px-McDonald%27s_Golden_Arches.svg.png",
    coverImageUrl: coverImage,
    location: "Piața Mihai Viteazu, Cluj-Napoca",
    rating: "7.4",
    isOpenUntil: "24:00",
    minOrder: 35.00,
};

export const mockProducts: Product[] = [
    {
        id: 1,
        name: "Big Mac",
        description: "The classic Big Mac burger with two beef patties, lettuce, cheese, pickles and special sauce.",
        price: 28.50,
        category: "Burgers and Chicken",
        allergens: ["gluten", "dairy", "mustard"],
        imageUrl: burgerImage
    },
    {
        id: 2,
        name: "McChicken",
        description: "Crispy chicken breast fillet with lettuce and mayonnaise in a soft bun.",
        price: 26.00,
        category: "Burgers and Chicken",
        allergens: ["gluten", "egg", "mustard"],
        imageUrl: burgerImage
    },
    {
        id: 3,
        name: "Big Mac Meal",
        description: "The meal includes a Big Mac sandwich, fries and a choice of soft drink.",
        price: 42.00,
        category: "Meals",
        allergens: ["gluten", "dairy", "mustard"],
        imageUrl: burgerImage
    },
    {
        id: 4,
        name: "McPuișor Meal",
        description: "The meal includes a McPuișor sandwich, fries and a choice of soft drink.",
        price: 35.50,
        category: "Meals",
        allergens: ["gluten", "soy"],
        imageUrl: burgerImage
    },
    {
        id: 5,
        name: "Caesar Salad with Grilled Chicken",
        description: "Fresh salad with grilled chicken, croutons and Caesar dressing.",
        price: 32.00,
        category: "Salads",
        allergens: ["gluten", "dairy", "fish"],
        imageUrl: burgerImage
    },
    {
        id: 6,
        name: "McFlurry OREO",
        description: "Vanilla ice cream mixed with crunchy OREO cookie pieces.",
        price: 14.50,
        category: "Desserts",
        allergens: ["gluten", "dairy", "soy"],
        imageUrl: burgerImage
    },
    {
        id: 7,
        name: "Apple Pie",
        description: "Hot baked apple pie served warm.",
        price: 8.00,
        category: "Desserts",
        allergens: ["gluten"],
        imageUrl: burgerImage
    },
    {
        id: 8,
        name: "Coca Cola",
        description: "Refreshing soft drink.",
        price: 9.00,
        category: "Soft Drinks",
        allergens: [],
        imageUrl: burgerImage
    },
    {
        id: 9,
        name: "Fanta Orange",
        description: "Refreshing orange soft drink.",
        price: 9.00,
        category: "Soft Drinks",
        allergens: [],
        imageUrl: burgerImage
    },
    {
        id: 10,
        name: "Strawberry Shake",
        description: "A creamy strawberry flavored shake.",
        price: 15.00,
        category: "Shakes",
        allergens: ["dairy"],
        imageUrl: burgerImage
    },
    {
        id: 11,
        name: "Chocolate Shake",
        description: "A rich chocolate flavored shake.",
        price: 15.00,
        category: "Shakes",
        allergens: ["dairy", "soy"],
        imageUrl: burgerImage
    },
    {
        id: 12,
        name: "Espresso",
        description: "A strong concentrated espresso shot.",
        price: 7.50,
        category: "Coffee and Hot Drinks",
        allergens: [],
        imageUrl: burgerImage
    },
    {
        id: 13,
        name: "Cappuccino",
        description: "Espresso with steamed milk and milk foam.",
        price: 11.00,
        category: "Coffee and Hot Drinks",
        allergens: ["dairy"],
        imageUrl: burgerImage
    },
    {
        id: 14,
        name: "Filet O Fish",
        description: "White fish fillet in a crispy coating with tartar sauce.",
        price: 25.00,
        category: "Fish Products",
        allergens: ["gluten", "fish", "dairy", "egg"],
        imageUrl: burgerImage
    },
    {
        id: 15,
        name: "Chicken Grill Wrap",
        description: "Grilled chicken pieces wrapped with vegetables and sauce.",
        price: 27.00,
        category: "Wraps",
        allergens: ["gluten", "dairy"],
        imageUrl: burgerImage
    },
    {
        id: 16,
        name: "McMuffin with Egg and Ham",
        description: "A breakfast classic with egg, ham and cheese on an English muffin.",
        price: 16.00,
        category: "Breakfast Menu",
        allergens: ["gluten", "dairy", "egg"],
        imageUrl: burgerImage
    },
    {
        id: 17,
        name: "Large Fries",
        description: "Large portion of french fries.",
        price: 10.00,
        category: "Sides",
        allergens: [],
        imageUrl: burgerImage
    },
    {
        id: 18,
        name: "Onion Rings",
        description: "Crispy battered onion rings.",
        price: 12.00,
        category: "Sides",
        allergens: ["gluten"],
        imageUrl: burgerImage
    },
    {
        id: 19,
        name: "Happy Meal with Chicken McNuggets",
        description: "4 pieces of Chicken McNuggets with a side and a toy.",
        price: 25.00,
        category: "Happy Meal",
        allergens: ["gluten", "mustard"],
        imageUrl: burgerImage
    },
    {
        id: 20,
        name: "Generous Maestro Burger",
        description: "A special edition burger with premium toppings.",
        price: 35.00,
        category: "Limited Editions",
        allergens: ["gluten", "dairy", "sesame seeds"],
        imageUrl: burgerImage
    },
    {
        id: 21,
        name: "Garlic Sauce",
        description: "Creamy garlic sauce for dipping.",
        price: 3.00,
        category: "Sauces",
        allergens: ["dairy", "egg"],
        imageUrl: burgerImage
    },
    {
        id: 22,
        name: "Barbecue Sauce",
        description: "Sweet and smoky barbecue sauce.",
        price: 3.00,
        category: "Sauces",
        allergens: ["mustard"],
        imageUrl: burgerImage
    },
    {
        id: 23,
        name: "McPlant",
        description: "A tasty plant based burger with fresh toppings.",
        price: 29.00,
        category: "Vegetarian",
        allergens: ["gluten", "mustard", "soy"],
        imageUrl: burgerImage
    },
    {
        id: 24,
        name: "McPlant",
        description: "A tasty plant based burger with fresh toppings.",
        price: 29.00,
        category: "Vegetarian",
        allergens: ["gluten", "mustard", "soy"],
        imageUrl: burgerImage
    },
    {
        id: 25,
        name: "McPlant",
        description: "A tasty plant based burger with fresh toppings.",
        price: 29.00,
        category: "Vegetarian",
        allergens: ["gluten", "mustard", "soy"],
        imageUrl: burgerImage
    },
    {
        id: 26,
        name: "McPlant",
        description: "A tasty plant based burger with fresh toppings.",
        price: 29.00,
        category: "Vegetarian",
        allergens: ["gluten", "mustard", "soy"],
        imageUrl: burgerImage
    },
    {
        id: 27,
        name: "McPlant",
        description: "A tasty plant based burger with fresh toppings.",
        price: 29.00,
        category: "Vegetarian",
        allergens: ["gluten", "mustard", "soy"],
        imageUrl: burgerImage
    }
];

export const mockRestaurants = [
    {
        id: 1,
        name: "Grande Pizza",
        slogan: "The best pizza in town",
        coverImageUrl: coverImage,
        location: "Plopilor Street 1, Cluj-Napoca",
        rating: "9.2",
        isOpenUntil: "23:00",
        minOrder: 40.00,
        discount: 40,
        products: mockProducts.filter(p => ["Pizzas", "Salads", "Soft Drinks"].includes(p.category)),
        tags: ["Pizza"],
    },
    {
        id: 2,
        name: "Express Chef",
        slogan: "Fast and tasty food",
        coverImageUrl: coverImage,
        location: "Eroilor Boulevard 10, Cluj-Napoca",
        rating: "8.5",
        isOpenUntil: "22:00",
        minOrder: 30.00,
        discount: 30,
        products: mockProducts.filter(p => ["Meals", "Soups", "Desserts"].includes(p.category)),
        tags: ["Traditional"],
    },
    {
        id: 3,
        name: "Sushi Master",
        slogan: "Authentic Japanese tradition",
        coverImageUrl: coverImage,
        location: "Unirii Square 5, Cluj-Napoca",
        rating: "9.5",
        isOpenUntil: "23:30",
        minOrder: 50.00,
        discount: 15,
        products: mockProducts.filter(p => ["Sushi", "Soups", "Appetizers"].includes(p.category)),
        tags: ["Sushi", "Asian"],
    },
    {
        id: 4,
        name: "Crab Tavern",
        slogan: "Taste of the sea delivered to your home",
        coverImageUrl: coverImage,
        location: "Memorandumului Street 20, Cluj-Napoca",
        rating: "9.8",
        isOpenUntil: "00:00",
        minOrder: 60.00,
        discount: 25,
        products: mockProducts.filter(p => p.category === "Fish Products"),
        tags: ["Seafood", "Fish"],
    },
    {
        id: 5,
        name: "McDonald's Mihai Viteazu",
        slogan: "i'm lovin' it",
        coverImageUrl: burgerImage,
        location: "Mihai Viteazu Square, Cluj-Napoca",
        rating: "7.4",
        isOpenUntil: new Date(new Date().setHours(22, 30, 0, 0)).toTimeString().substring(0, 5),
        minOrder: 35.00,
        discount: 10,
        products: mockProducts,
        tags: ["Burger", "Fast Food", "American"],
    }
];

export const mockCoupons = [
    {
        id: 1,
        value: "15% OFF",
        description: "15 percent discount on any beef meal ordered.",
        validFrom: new Date('2025-09-10'),
        validTo: new Date('2025-09-20')
    },
    {
        id: 2,
        value: "FREE",
        description: "Free portion of fries with the purchase of any burger.",
        validFrom: new Date('2025-09-15'),
        validTo: new Date('2025-09-30')
    },
    {
        id: 3,
        value: "15% OFF",
        description: "15 percent discount on any beef meal ordered.",
        validFrom: new Date('2025-09-10'),
        validTo: new Date('2025-09-20')
    },
    {
        id: 4,
        value: "FREE",
        description: "Free portion of fries with the purchase of any burger.",
        validFrom: new Date('2025-09-15'),
        validTo: new Date('2025-09-30')
    }
];

export const allergens = ["gluten", "dairy", "egg", "fish", "soy", "mustard"];