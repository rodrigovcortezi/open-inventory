import {z} from 'zod'

export const UserSchema = z.object({
  name: z.string().trim(),
  email: z.string().trim().email(),
  password: z.string().min(8),
})

export const PartialUserSchema = UserSchema.partial()

export type CreateUserDto = z.infer<typeof UserSchema>

export type UpdateUserDto = z.infer<typeof PartialUserSchema>
