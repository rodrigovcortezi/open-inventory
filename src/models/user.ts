import {Business} from './business'

export type User = {
  name: string
  email: string
  password: string
  business: Business
  createdAt: Date
  updateAt: Date
}
