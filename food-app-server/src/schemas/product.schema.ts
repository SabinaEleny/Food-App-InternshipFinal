import { z } from 'zod';

const urlRegex = /^(https?:\/\/).+/i;
const objectId = /^[a-f\d]{24}$/i;

const ProductOptionValueZ = z.object({
  label: z.string().min(1),
  priceDelta: z.number().int(),
});

const ProductOptionZ = z.object({
  name: z.string().min(1),
  required: z.boolean().optional().default(false),
  values: z.array(ProductOptionValueZ).min(1),
});

const ProductAddOnZ = z.object({
  label: z.string().min(1),
  price: z.number().int().nonnegative(),
});

export const CreateProductSchema = z.object({
  restaurantId: z.string().regex(objectId),
  name: z.string().min(2).max(120),
  description: z.string().max(1000).optional(),
  images: z.array(z.string().regex(urlRegex)).optional(),
  category: z.string().min(1),
  price: z.number().int().nonnegative(),
  discountPrice: z.number().int().nonnegative().optional(),
  options: z.array(ProductOptionZ).optional(),
  addOns: z.array(ProductAddOnZ).optional(),
  tags: z.array(z.string().min(1)).optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial().refine(
  (data) => {
    if (data.price != null && data.discountPrice != null) {
      return data.discountPrice <= data.price;
    }
    return true;
  },
  { message: 'discountPrice must be less than or equal to price' },
);

export const AvailabilitySchema = z.object({ isAvailable: z.boolean() });
