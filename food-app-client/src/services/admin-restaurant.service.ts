import apiClient from '@/api/api-client.ts';
import type { BackendRestaurant } from '@/services/restaurant.service.ts';
import type { Product } from '@/types';

export interface RestaurantData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  categories: string[];
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

const API_URL = "/admin/restaurants";

export const getAllAdminRestaurants = async (): Promise<BackendRestaurant[]> => {
  const { data } = await apiClient.get<BackendRestaurant[]>(API_URL);
  return data;
};

export const getProductsByRestaurantId = async (restaurantId: string): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>(`${API_URL}/${restaurantId}/products`);
  return data;
};

export const createRestaurant = async (data: RestaurantData): Promise<BackendRestaurant> => {
  const { data: newRestaurant } = await apiClient.post<BackendRestaurant>(API_URL, data);
  return newRestaurant;
};

export const updateRestaurantById = async (id: string, data: Partial<RestaurantData>): Promise<BackendRestaurant> => {
  const { data: updatedRestaurant } = await apiClient.put<BackendRestaurant>(`${API_URL}/${id}`, data);
  return updatedRestaurant;
};

export const deleteRestaurantById = async (id: string): Promise<void> => {
  await apiClient.delete(`${API_URL}/${id}`);
};

export const createProduct = async (restaurantId: string, data: ProductData): Promise<Product> => {
  const { data: newProduct } = await apiClient.post<Product>(`${API_URL}/${restaurantId}/products`, data);
  return newProduct;
};

export const updateProductById = async (productId: string, data: Partial<ProductData>): Promise<Product> => {
  const { data: updatedProduct } = await apiClient.put<Product>(`/admin/products/${productId}`, data);
  return updatedProduct;
};

export const deleteProductById = async (productId: string): Promise<void> => {
  await apiClient.delete(`/admin/products/${productId}`);
};