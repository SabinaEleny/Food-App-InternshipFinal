import type {Cart, CartItem, Product, RestaurantBrief} from "@/types";
import apiClient from "@/api/api-client.ts";

type BackendProductInCart = {
    _id: string;
    name: string;
    images: string[];
    price: number;
    discountPrice?: number;
};

type BackendCartItem = {
    product: BackendProductInCart;
    quantity: number;
};

type BackendRestaurantInCart = {
    _id: string;
    name: string;
    slug: string;
};

type BackendCart = {
    _id: string;
    userId: string;
    restaurantId?: BackendRestaurantInCart;
    items: BackendCartItem[];
    createdAt: string;
    updatedAt: string;
};

function mapProductInCart(doc: BackendProductInCart): Product {
    return {
        id: doc._id,
        name: doc.name,
        price: doc.price,
        discountPrice: doc.discountPrice,
        images: doc.images ?? [],
        imageUrl: doc.images?.[0],
        restaurantId: '',
        slug: '',
        category: '',
        isAvailable: true,
        archived: false,
        sortOrder: 0,
        createdAt: '',
        updatedAt: '',
    };
}

function mapCartItem(doc: BackendCartItem): CartItem {
    return {
        product: mapProductInCart(doc.product),
        quantity: doc.quantity,
    };
}

function mapCart(doc: BackendCart): Cart {
    const restaurant: RestaurantBrief | undefined = doc.restaurantId
        ? {id: doc.restaurantId._id, name: doc.restaurantId.name, slug: doc.restaurantId.slug}
        : undefined;

    return {
        id: doc._id,
        userId: doc.userId,
        restaurant: restaurant,
        items: (doc.items ?? []).map(mapCartItem),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}

export type UpsertCartItemData = {
    productId: string;
    quantity: number;
};

export async function fetchCart(): Promise<Cart> {
    const {data} = await apiClient.get<BackendCart>('/cart');
    return mapCart(data);
}

export async function upsertItemInCart(itemData: UpsertCartItemData): Promise<Cart> {
    const {data} = await apiClient.post<BackendCart>('/cart/items', itemData);
    return mapCart(data);
}

export async function updateItemQuantityInCart(itemData: UpsertCartItemData): Promise<Cart> {
    const {data} = await apiClient.patch<BackendCart>('/cart/items', itemData);
    return mapCart(data);
}

export async function removeItemFromCart(productId: string): Promise<Cart> {
    const {data} = await apiClient.delete<BackendCart>(`/cart/items/${productId}`);
    return mapCart(data);
}