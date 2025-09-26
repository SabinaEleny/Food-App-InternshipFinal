import { useQuery } from '@tanstack/react-query';
import { getAllCouriers } from '@/services/courier.service';

export const useCouriers = () => {
  return useQuery({
    queryKey: ['couriers'],
    queryFn: getAllCouriers,
    staleTime: 1000 * 60 * 5,
  });
};