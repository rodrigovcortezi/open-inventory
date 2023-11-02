import {Product} from '~/models/product'

export type CreateProductDTO = {
  name: string
  description?: string
  sku: string
  ean: string
  businessId: number
}

export interface ProductRepository {
  create: (data: CreateProductDTO) => Promise<Product>
}
