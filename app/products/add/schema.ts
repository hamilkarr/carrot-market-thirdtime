import { z } from 'zod';

export const productSchema = z.object({
  photo: z.string({
    required_error: 'Photo is required',
  }),
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(3, 'Title must be at least 3 characters'),
  price: z.coerce
    .number({
      required_error: 'Price is required',
    })
    .min(1000, 'Price must be at least 1000'),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .min(3, 'Description must be at least 10 characters'),
});

export type ProductSchema = z.infer<typeof productSchema>;
