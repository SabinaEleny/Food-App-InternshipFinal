import apiClient from '../api/api-client';
import type { Courier, VehicleType } from '../types';

export type CourierData = {
  firstName: string;
  lastName: string;
  phone: string;
  vehicleType: VehicleType;
  isAvailable: boolean;
};


export const getAllCouriers = async (): Promise<Courier[]> => {
  const response = await apiClient.get<Courier[]>('/couriers');
  return response.data;
};

export const createCourier = async (data: CourierData): Promise<Courier> => {
  const response = await apiClient.post<Courier>('/couriers', data);
  return response.data;
};

export const updateCourierById = async (courierId: string, data: Partial<CourierData>): Promise<Courier> => {
  const response = await apiClient.patch<Courier>(`/couriers/${courierId}`, data);
  return response.data;
};

export const deleteCourierById = async (courierId: string): Promise<void> => {
  await apiClient.delete(`/couriers/${courierId}`);
};