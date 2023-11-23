import {z} from 'zod'

export const InventoryProductSchema = z.object({
  quantity: z.number().int(),
})
