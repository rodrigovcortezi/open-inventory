import {z} from 'zod'

export const InventoryProductSchema = z.object({
  variation: z.number().int(),
})
