import {safeBusiness, type Business, type SafeBusiness} from './business'

export enum Role {
  ADMIN = 'ADMIN',
  STORE = 'STORE',
  SUPPLIER = 'SUPPLIER',
}

export type User = {
  id: number
  name: string
  email: string
  password: string
  role: Role
  businessId: number
  createdAt: Date
  updatedAt: Date
}

export type UserWithBusiness = User & {
  business: Business
}

export type SafeUser = Omit<
  User,
  'id' | 'password' | 'role' | 'businessId' | 'createdAt' | 'updatedAt'
>

export type SafeUserWithBusiness = SafeUser & {
  business: SafeBusiness
}

export const safeUser = (user: User): SafeUser => {
  const {name, email} = user
  return {name, email}
}

export const safeUserWithBusiness = (
  user: UserWithBusiness,
): SafeUserWithBusiness => {
  const {name, email, business} = user
  return {name, email, business: safeBusiness(business)}
}
