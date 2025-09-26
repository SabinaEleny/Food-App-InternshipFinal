import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { toggleFavoriteRestaurant } from '@/services/favorite.service.ts';
import type { User } from '@/types';

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useMutation({
    mutationFn: toggleFavoriteRestaurant,
    onSuccess: (data) => {
      const oldUser = queryClient.getQueryData<User>(['user']);
      const oldFavoritesCount = oldUser?.favorites?.length ?? 0;

      queryClient.setQueryData(['user'], data.user);

      if (data.user.favorites.length > oldFavoritesCount) {
        toast.success('Restaurant added to favorites!');
      } else {
        toast.info('Restaurant removed from favorites.');
      }
    },
    onError: (error) => {
      console.error("Favorite toggle mutation failed:", error);
      const message = isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : 'An error occurred. Please try again.';
      toast.error(message);
    },
  });

  return { toggleFavorite, isTogglingFavorite };
};