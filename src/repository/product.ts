import {Product} from '~/models/product'

export type CreateProductDTO = {
  name: string
  description?: string
  sku: string
  ean: string
  businessId: number
}

export interface ProductRepository {
  findById: (id: number) => Promise<Product | null>
  create: (data: CreateProductDTO) => Promise<Product>
  delete: (id: number) => Promise<Product>
}
