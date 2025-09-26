import apiClient from '../api/api-client';
import type { AuthResponse, User } from '@/types';

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type UpdateUserData = Partial<Pick<User, 'name' | 'email' | 'phone'>>;

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const fetchCurrentUser = async (): Promise<AuthResponse> => {
  const response = await apiClient.get<AuthResponse>('/users/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.get('/auth/logout');
};

export const updateCurrentUser = async (data: UpdateUserData): Promise<AuthResponse> => {
  const response = await apiClient.patch<AuthResponse>('/users/me', data);
  return response.data;
};

export const verifyEmailToken = async (token: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/auth/verify-email', { token });
  return response.data;
};