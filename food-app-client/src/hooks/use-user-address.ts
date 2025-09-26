import {useAuth} from "@/hooks/use-auth.ts";
import {useQuery} from "@tanstack/react-query";
import type {Address} from "@/types";

export function useUserAddresses() {
    const {user} = useAuth();
    return useQuery<Address[]>({
        queryKey: ['user', user?._id, 'addresses'],
        queryFn: () => user?.addresses || [],
        enabled: !!user,
    });
}