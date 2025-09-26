import {useQuery} from '@tanstack/react-query';
import {fetchCategories} from "@/services/product-service.ts";

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 60,
    });
}