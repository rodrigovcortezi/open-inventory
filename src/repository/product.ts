import {Product} from '~/models/product'

export type CreateProductDTO = {
  name: string
  description?: string
  sku: string
  ean: string
  businessId: number
}

export type UpdateProductDTO = {
  name?: string
  description?: string
  sku?: string
  ean?: string
}

export interface ProductRepository {
  findById: (id: number) => Promise<Product | null>
  create: (data: CreateProductDTO) => Promise<Product>
  update: (id: number, data: UpdateProductDTO) => Promise<Product>
  delete: (id: number) => Promise<Product>
}