import {z} from 'zod'
import {cnpj} from 'cpf-cnpj-validator'

export const BusinessSchema = z.object({
  name: z.string(),
  cnpj: z
    .string()
    .refine(val => cnpj.isValid(val), {message: 'Invalid CNPJ number'}),
})

export const PartialBusinessSchema = BusinessSchema.partial()
