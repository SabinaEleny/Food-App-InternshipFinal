import { z } from 'zod';

export const postMessageSchema = z.object({
  message: z.string().min(1, 'Message is required and cannot be empty'),
  conversationId: z.string().nullable().optional(),
});
