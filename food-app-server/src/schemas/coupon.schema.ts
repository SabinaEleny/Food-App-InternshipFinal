import { z } from 'zod';

const objectId = /^[a-f\d]{24}$/i;

export const CreateCouponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3)
      .max(20)
      .transform((val) => val.toUpperCase()),
    type: z.enum(['percent', 'fixed']),
    value: z.number().int().positive('Value must be a positive integer'),
    restaurantId: z.string().regex(objectId, 'Invalid restaurant ID').nullable().optional(),
    minOrderAmount: z.number().int().nonnegative().optional(),
    usageLimit: z.number().int().positive().optional(),
    perUserLimit: z.number().int().positive().optional(),
    validFrom: z.coerce.date().optional(),
    validUntil: z.coerce.date().optional(),
    status: z.enum(['active', 'inactive', 'expired']).optional().default('active'),
  })
  .refine(
    (data) => {
      if (data.validFrom && data.validUntil) {
        return data.validUntil > data.validFrom;
      }
      return true;
    },
    {
      message: 'validUntil must be after validFrom',
      path: ['validUntil'],
    },
  );

export const UpdateCouponSchema = CreateCouponSchema.partial().omit({
  code: true,
});
