import {z} from 'zod'

export const CreateInventorySchema = z.object({
  name: z.string().trim().min(1),
})

export const UpdateInventorySchema = CreateInventorySchema.partial()
