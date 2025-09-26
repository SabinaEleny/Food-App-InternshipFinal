import { useQuery } from '@tanstack/react-query';
import { fetchRestaurantById, fetchRestaurants } from '@/services/restaurant.service.ts';

export function useRestaurants(page = 1, limit = 12, allergen: string | null = null, category: string | null = null) {
    return useQuery({
        queryKey: ["restaurants", {page, limit, allergen, category}],
        queryFn: () => fetchRestaurants(page, limit, allergen, category),
    });
}

export function useRestaurant(id: string | undefined) {
    return useQuery({
        queryKey: ["restaurants", id],
        queryFn: () => fetchRestaurantById(id as string),
        enabled: !!id,
    });
}