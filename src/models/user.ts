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
  business: Business
  role: Role
  createdAt: Date
  updatedAt: Date
}

export type SafeUser = Omit<
  User,
  'id' | 'password' | 'business' | 'role' | 'createdAt' | 'updatedAt'
> & {business: SafeBusiness}

export const safeUser = (user: User): SafeUser => {
  const {name, email, business} = user
  return {name, email, business: safeBusiness(business)}
}
