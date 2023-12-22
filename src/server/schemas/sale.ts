import {z} from 'zod'

export const CreateSaleSchema = z.object({
  externalID: z.string().trim().min(1).optional(),
  inventory: z.string().trim().min(1),
  items: z.array(
    z.object({
      sku: z.string().min(1),
      quantity: z.number().int().nonnegative(),
    }),
  ),
})
