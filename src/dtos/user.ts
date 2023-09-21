import {z} from 'zod'

const HasPassword = z.object({password: z.string().min(8)})

export const UserSchema = z.object({
  name: z.string().trim(),
  email: z.string().trim().email(),
})

export const CreateUserSchema = UserSchema.merge(HasPassword)

export const PartialUserSchema = UserSchema.partial()

export const LoginUserSchema = UserSchema.merge(HasPassword).omit({name: true})

export type CreateUserDto = z.infer<typeof CreateUserSchema>

export type UpdateUserDto = z.infer<typeof PartialUserSchema>

export type LoginUserDto = z.infer<typeof LoginUserSchema>
