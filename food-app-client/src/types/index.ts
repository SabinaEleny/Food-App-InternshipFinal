export type UserRole = 'customer' | 'admin';

export const UserRoles = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const;

export type VehicleType = 'motorcycle' | 'car' | 'bicycle';

export const VehicleTypes = {
  MOTORCYCLE: 'motorcycle',
  CAR: 'car',
  BICYCLE: 'bicycle',
} as const;

export type Address = {
  _id: string;
  title: string;
  street: string;
  city: string;
};
export type ProductOptionValue = { label: string; priceDelta: number };
export type ProductOption = { name: string; required: boolean; values: ProductOptionValue[] };
export type ProductAddOn = { label: string; price: number };

export type Card = {
  _id: string;
  cardType: string;
  last4Digits: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  emailVerified: boolean;
  avatarUrl?: string;
  cards: Card[];
  addresses: Address[];
  favorites: Restaurant[];
  createdAt: string;
  updatedAt: string;
}

export type AuthResponse = {
  user: User;
  token?: string;
}

export type Product = {
  _id: string;
  restaurantId: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  imageUrl?: string;
  category: string;
  price: number;
  discountPrice?: number;
  options?: ProductOption[];
  addOns?: ProductAddOn[];
  tags?: string[];
  isAvailable: boolean;
  sortOrder: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  allergens?: string[];
};
import { categoryIcons } from '@/utils/icons/category-icons.ts';

export type Restaurant = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  images?: {
    icon?: string;
    cover?: string;
    banner?: string;
  };
  rating?: number;
  location?: {
    address?: string;
    coordinates?: [number, number];
  };
  openingHours?: { from: string; to: string };
  delivery?: { minOrder?: number; fee?: number; estimatedMinutes?: number };
  categories?: string[];
  tags?: string[];
  discount?: number;
};

export type RestaurantTableRowProps = Omit<Restaurant, 'products' | 'description'> & {
  productCount: number;
  onManageMenu: () => void;
};

export type SortOption = {
  value: string;
  label: string;
};

export type Courier = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  vehicleType: VehicleType;
  isAvailable: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type CategoryTag = keyof typeof categoryIcons;

export type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  restaurantId?: string | null;
  minOrderAmount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  validFrom?: Date;
  validUntil?: Date;
  status: string;
  createdAt: string;
  updatedAt: string;
};

///A simplified type for restaurant - to represent the restaurant for the cart
export type RestaurantBrief = {
  id: string;
  name: string;
  slug: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = {
  id: string;
  userId: string;
  restaurant?: RestaurantBrief;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  userId: string;
  restaurantId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    qty: number;
  }[];
  amounts: {
    subtotal: number;
    discount: number;
    deliveryFee: number;
    tax: number;
    total: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
};

export interface ConversationSummary {
  _id: string;
  title: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export type OrderHistoryItem = Order & {
  restaurantId: {
    _id: string;
    name: string;
    images?: {
      logoUrl?: string;
    };
  };
};