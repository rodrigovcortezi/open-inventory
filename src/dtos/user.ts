import {z} from 'zod'
import {cnpj} from 'cpf-cnpj-validator'

const HasPassword = z.object({password: z.string().min(8)})

export const UserSchema = z.object({
  name: z.string().trim(),
  email: z.string().trim().email(),
  business: z.object({
    name: z.string(),
    cnpj: z
      .string()
      .refine(val => cnpj.isValid(val), {message: 'Invalid CNPJ number'}),
  }),
})

export const CreateUserSchema = UserSchema.merge(HasPassword)

export const PartialUserSchema = UserSchema.partial().omit({business: true})

export const LoginUserSchema = UserSchema.merge(HasPassword).omit({
  name: true,
  business: true,
})

export type CreateUserDto = z.infer<typeof CreateUserSchema>

export type UpdateUserDto = z.infer<typeof PartialUserSchema>

export type LoginUserDto = z.infer<typeof LoginUserSchema>
