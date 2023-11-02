import {z} from 'zod'

export const CreateProductSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional().nullable(),
  sku: z.string().trim().min(1),
  ean: z.string().trim().min(1),
})

export const UpdateProductSchema = CreateProductSchema.partial()
