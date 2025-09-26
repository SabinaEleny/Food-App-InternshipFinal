import {useQuery} from "@tanstack/react-query";
import {useAuth} from "@/hooks/use-auth.ts";
import type {OrderHistoryItem} from "@/types";
import {fetchMyOrders} from "@/services/order-service.ts";

export function useOrders() {
    const {user} = useAuth();
    return useQuery<OrderHistoryItem[]>({
        queryKey: ['orders', user?._id],
        queryFn: fetchMyOrders,
        enabled: !!user,
    });
}