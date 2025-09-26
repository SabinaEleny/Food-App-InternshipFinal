import {useQuery} from "@tanstack/react-query";
import {fetchProductsByRestaurant} from "@/services/product-service";

export function useProductsByRestaurant(restaurantId: string | undefined, page = 1, limit = 400) {
    return useQuery({
        queryKey: ["products", {restaurantId, page, limit}],
        queryFn: () => fetchProductsByRestaurant(restaurantId as string, page, limit),
        enabled: !!restaurantId,
    });
}