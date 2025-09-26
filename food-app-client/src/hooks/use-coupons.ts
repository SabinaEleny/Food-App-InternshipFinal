import {useQuery} from "@tanstack/react-query";
import {fetchCoupons} from "@/services/coupon-service";

export function useCoupons(page = 1, limit = 20) {
    return useQuery({
        queryKey: ["coupons", {page, limit}],
        queryFn: () => fetchCoupons(page, limit),
    });
}