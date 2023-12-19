import {safeBusiness, type Business, type SafeBusiness} from './business'

export type User = {
  id: number
  name: string
  email: string
  password: string
  business: Business
  createdAt: Date
  updatedAt: Date
}

export type SafeUser = Omit<
  User,
  'id' | 'password' | 'business' | 'createdAt' | 'updatedAt'
> & {business: SafeBusiness}

export const safeUser = (user: User): SafeUser => {
  const {name, email, business} = user
  return {name, email, business: safeBusiness(business)}
}
