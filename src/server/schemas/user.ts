import {z} from 'zod'
import {BusinessSchema} from './business'

const HasPassword = z.object({password: z.string().min(8)})

export const UserSchema = z.object({
  name: z.string().trim(),
  email: z.string().trim().email(),
  business: BusinessSchema,
})

export const CreateUserSchema = UserSchema.merge(HasPassword)

export const PartialUserSchema = UserSchema.partial().omit({business: true})

export const LoginUserSchema = UserSchema.merge(HasPassword).omit({
  name: true,
  business: true,
})

export type CreateUserReq = z.infer<typeof CreateUserSchema>

export type UpdateUserReq = z.infer<typeof PartialUserSchema>

export type LoginUserReq = z.infer<typeof LoginUserSchema>
