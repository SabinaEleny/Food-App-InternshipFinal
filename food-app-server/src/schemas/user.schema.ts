import { z } from 'zod';

// Regex to validate a 10-digit Romanian phone number starting with 0
const romanianPhoneNumberRegex = /^0[237]\d{8}$/;

const phoneSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, ''))
  .refine((val) => romanianPhoneNumberRegex.test(val), {
    message: 'Phone number must be a valid Romanian format (e.g., 07xx xxx xxx)',
  });

// Schema for POST /api/auth/register
export const registerUserSchema = z.object({
  name: z.string().min(2, '...').max(80, '...'),
  email: z.string().min(1, '...').email('...'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/\d/, 'Password must contain at least one number.')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Password must contain at least one special character.',
    ),
  phone: phoneSchema.optional(),
});

// Schema for POST /api/auth/login
export const loginUserSchema = z.object({
  email: z.string().min(1, '...').email('...'),
  password: z.string().min(1, '...'),
});

// Schema for PATCH /api/users/me
export const updateUserProfileSchema = z.object({
  name: z.string().min(2, '...').max(80, '...').optional(),
  phone: phoneSchema.optional(),
  avatarUrl: z.string().url('...').optional(),
});

// --- TypeScript types inferred from schemas ---
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
