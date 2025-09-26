import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const invalidIdMessage = 'Invalid ID format';

const OrderItemSchema = z.object({
  productId: z.string().regex(objectIdRegex, { message: invalidIdMessage }),
  qty: z
    .number()
    .int({ message: 'Quantity must be an integer' })
    .positive({ message: 'Quantity must be positive' }),
  addOnIds: z
    .array(z.string().regex(objectIdRegex, { message: `Invalid Add-on ID format` }))
    .optional(),
  notes: z.string().optional(),
});

const AddressSchema = z.object({
  street: z.string().min(1, { message: 'Street is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  postalCode: z.string().min(1, { message: 'Postal code is required' }),
  details: z.string().optional(),
});

export const createOrderSchema = z.object({
  address: AddressSchema,
  specialInstructions: z.string().optional(),
  deliveryMethod: z.enum(['delivery', 'pickup']),
  tipPercentage: z.number().int().nonnegative().default(0),
  paymentMethod: z.enum(['card', 'cash']),
  paymentIntentId: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
