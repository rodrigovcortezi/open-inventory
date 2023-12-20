import {z} from 'zod'
import {BusinessSchema} from './business'

const HasPassword = z.object({password: z.string().min(8)})

export const UserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  business: BusinessSchema,
})

export const CreateUserSchema = UserSchema.merge(HasPassword)

export const PartialUserSchema = CreateUserSchema.partial().omit({
  business: true,
})

export const LoginUserSchema = UserSchema.merge(HasPassword).omit({
  name: true,
  business: true,
})

export const AddAdminUserSchema = CreateUserSchema.omit({business: true})

export const AddStoreUserSchema = CreateUserSchema.omit({business: true})

export const AddSupplierUserSchema = CreateUserSchema.omit({
  business: true,
}).extend({supplierCode: z.string().trim()})

export type CreateUserReq = z.infer<typeof CreateUserSchema>

export type UpdateUserReq = z.infer<typeof PartialUserSchema>

export type LoginUserReq = z.infer<typeof LoginUserSchema>
