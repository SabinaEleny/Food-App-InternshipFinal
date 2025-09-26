import {useQuery} from "@tanstack/react-query";
import {fetchAllergens} from "@/services/product-service.ts";

export function useAllergens() {
    return useQuery({
        queryKey: ['allergens'],
        queryFn: fetchAllergens,
        staleTime: 1000 * 60 * 60,
    });
}