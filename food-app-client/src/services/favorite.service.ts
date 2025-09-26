import apiClient from '../api/api-client';
import type { User } from '@/types';

export const toggleFavoriteRestaurant = async (restaurantId: string): Promise<{ user: User }> => {
  const { data } = await apiClient.post<{ user: User }>('/users/me/favorites/toggle', { restaurantId });
  return data;
};