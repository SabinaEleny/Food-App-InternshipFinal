import {useQuery} from "@tanstack/react-query";
import {fetchCart} from "@/services/cart-service";

export function useCart(enabled: boolean = true) {
    return useQuery({
        queryKey: ["cart"],
        queryFn: fetchCart,
        enabled: enabled,
    });
}