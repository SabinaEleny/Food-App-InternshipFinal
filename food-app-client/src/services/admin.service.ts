import apiClient from '../api/api-client';
import type { User, UserRole } from '@/types';

export type UpdateUserData = Partial<Pick<User, 'name' | 'email' | 'phone' | 'role'>>;

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
};

export const createUser = async (data: CreateUserData): Promise<{ user: User }> => {
  const response = await apiClient.post<{ user: User }>('/users', data);
  return response.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
};

export const updateUserById = async (userId: string, data: UpdateUserData): Promise<User> => {
  const response = await apiClient.patch<{ user: User }>(`/users/${userId}`, data);
  return response.data.user;
};

export const deleteUserById = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};