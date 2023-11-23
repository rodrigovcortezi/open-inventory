import {Business} from './business'

export type Product = {
  id: number
  name: string
  description?: string | null
  sku: string
  ean: string
  business: Business
}
