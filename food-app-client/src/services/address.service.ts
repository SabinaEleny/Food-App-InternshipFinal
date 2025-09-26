import apiClient from '@/api/api-client';
import type { Address, User } from '@/types';

type AddressData = Omit<Address, '_id'>;

export const addAddress = async (data: AddressData): Promise<{ user: User }> => {
  const response = await apiClient.post<{ user: User }>('/users/me/addresses', data);
  return response.data;
};

export const updateAddress = async (addressId: string, data: Partial<AddressData>): Promise<{ user: User }> => {
  const response = await apiClient.patch<{ user: User }>(`/users/me/addresses/${addressId}`, data);
  return response.data;
};

export const deleteAddress = async (addressId: string): Promise<{ user: User }> => {
  const response = await apiClient.delete<{ user: User }>(`/users/me/addresses/${addressId}`);
  return response.data;
};