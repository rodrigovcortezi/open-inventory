import {Business} from './business'

export type Product = {
  name: string
  description?: string | null
  sku: string
  ean: string
  business: Business
}
