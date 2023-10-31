import {z} from 'zod'

export const CreateSupplierSchema = z.object({
  name: z.string(),
})
