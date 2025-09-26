import { z } from 'zod';
import { VehicleType } from '../utils/enums';

const romanianPhoneNumberRegex = /^0[237]\d{8}$/;

const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .transform((val) => val.replace(/\D/g, ''))
  .refine((val) => romanianPhoneNumberRegex.test(val), {
    message: 'Phone number must be a valid Romanian format (e.g., 07xx xxx xxx)',
  });

export const createCourierSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: phoneSchema,
  vehicleType: z.nativeEnum(VehicleType),
});

export const updateCourierSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: phoneSchema.optional(),
  vehicleType: z.nativeEnum(VehicleType).optional(),
  isAvailable: z.boolean().optional(),
});

export const updateCourierAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export type CreateCourierInput = z.infer<typeof createCourierSchema>;
export type UpdateCourierInput = z.infer<typeof updateCourierSchema>;
export type UpdateCourierAvailabilityInput = z.infer<typeof updateCourierAvailabilitySchema>;
