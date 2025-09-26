import type {Product, ProductAddOn, ProductOption} from "@/types";
import apiClient from "@/api/api-client.ts";

type BackendProduct = {
    _id: string;
    restaurantId: string;
    name: string;
    slug: string;
    description?: string;
    images: string[];
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

type ProductsResponseBackend = {
    products: BackendProduct[];
    total: number;
    page: number;
    totalPages: number;
};

export type ProductsResponse = {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
};

function mapProduct(doc: BackendProduct): Product {
    return {
        id: doc._id,
        restaurantId: doc.restaurantId,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        images: doc.images ?? [],
        imageUrl: doc.images?.[0],
        category: doc.category,
        price: doc.price,
        discountPrice: doc.discountPrice,
        options: doc.options,
        addOns: doc.addOns,
        tags: doc.tags,
        isAvailable: doc.isAvailable,
        sortOrder: doc.sortOrder,
        archived: doc.archived,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        allergens: doc.allergens
    };
}

export async function fetchProductsByRestaurant(
    restaurantId: string,
    page = 1,
    limit = 400
): Promise<ProductsResponse> {
    const {data} = await apiClient.get<ProductsResponseBackend>("/products", {
        params: {restaurantId, page, limit},
    });
    return {
        products: (data.products ?? []).map(mapProduct),
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
    };
}

export async function fetchAllergens(): Promise<string[]> {
    try {
        const {data} = await apiClient.get<string[]>('/products/allergens');
        return data || [];
    } catch (error) {
        console.error("Failed to fetch allergens:", error);
        throw error;
    }
}

export async function fetchCategories(): Promise<string[]> {
    const {data} = await apiClient.get<string[]>('/restaurants/categories');
    return data || [];
}
