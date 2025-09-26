import { z } from 'zod';

const urlRegex = /^(https?:\/\/).+/i;
const objectId = /^[a-f\d]{24}$/i;
const timeRegex = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/; // HH:MM

const OpeningHoursSchema = z.object({
  from: z.string().regex(timeRegex),
  to: z.string().regex(timeRegex),
});

export const CreateRestaurantSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(1000).optional(),
  images: z
    .object({
      logoUrl: z.string().regex(urlRegex).optional(),
      coverUrl: z.string().regex(urlRegex).optional(),
    })
    .optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
  }),
  openingHours: z.record(z.string(), z.array(OpeningHoursSchema)).optional(),
  status: z.enum(['draft', 'active', 'inactive']).optional().default('draft'),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  delivery: z
    .object({
      minOrder: z.number().positive().optional(),
      fee: z.number().nonnegative().optional(),
      estimatedMinutes: z.number().positive().int().optional(),
    })
    .optional(),
  ownerUserId: z.string().regex(objectId).optional(),
});

export const UpdateRestaurantSchema = CreateRestaurantSchema.partial();
