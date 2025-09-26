import type {Restaurant} from "@/types";
import apiClient from "@/api/api-client.ts";

type BackendInterval = { from: string; to: string };
type BackendOpeningHours = Record<string, BackendInterval[]>;

type BackendDelivery = {
    minOrder?: number;
    fee?: number;
    estimatedMinutes?: number;
};

export type BackendRestaurant = {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    images: { logoUrl?: string; coverUrl?: string };
    phone?: string;
    email?: string;
    address: string;
    location: { type: "Point"; coordinates: [number, number] };
    openingHours: BackendOpeningHours;
    status: "draft" | "active" | "inactive";
    categories: string[];
    tags?: string[];
    delivery?: BackendDelivery;
    ownerUserId?: string;
    createdAt: string;
    updatedAt: string;
};

type RestaurantsResponseBackend = {
    restaurants: BackendRestaurant[];
    total: number;
    page: number;
    totalPages: number;
};

export type RestaurantsResponse = {
    restaurants: Restaurant[];
    total: number;
    page: number;
    totalPages: number;
};

function todayInterval(opening?: BackendOpeningHours) {
    if (!opening) return undefined;
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const key = days[new Date().getDay()];
    const first = opening[key]?.[0];
    return first ? {from: first.from, to: first.to} : undefined;
}

function mapRestaurant(doc: BackendRestaurant): Restaurant {
    return {
        id: doc._id,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        images: {
            icon: doc.images?.logoUrl,
            cover: doc.images?.coverUrl,
            banner: undefined,
        },
        rating: undefined,
        location: {
            address: doc.address,
            coordinates: doc.location?.coordinates,
        },
        openingHours: todayInterval(doc.openingHours),
        delivery: doc.delivery,
        categories: doc.categories,
        tags: doc.tags,
        discount: undefined,
    };
}

export async function fetchRestaurants(
    page = 1,
    limit = 12,
    allergen: string | null,
    category: string | null
): Promise<RestaurantsResponse> {
    const {data} = await apiClient.get<RestaurantsResponseBackend>("/restaurants", {
        params: {page, limit, allergen, category},
    });
    return {
        restaurants: (data.restaurants ?? []).map(mapRestaurant),
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
    };
}

export async function fetchRestaurantById(id: string): Promise<Restaurant> {
    const {data} = await apiClient.get<BackendRestaurant>(`/restaurants/${id}`);
    return mapRestaurant(data);
}