import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const invalidIdMessage = 'Invalid ID format';

// Schema for adding an item or updating its quantity
export const upsertCartItemSchema = z.object({
  productId: z.string().regex(objectIdRegex, invalidIdMessage),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const removeCartItemSchema = z.object({
  productId: z.string().regex(objectIdRegex, invalidIdMessage),
});

export type UpsertCartItemInput = z.infer<typeof upsertCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;
