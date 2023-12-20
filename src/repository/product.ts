import type {Product, ProductWithSupplier} from '~/models/product'

export type CreateProductDTO = {
  name: string
  description?: string
  sku: string
  ean?: string
  businessId: number
  supplierId: number
}

export type UpdateProductDTO = {
  name?: string
  description?: string
  sku?: string
  ean?: string
  supplierId?: number
}

export interface ProductRepository {
  findById: (id: number) => Promise<Product | null>
  findBySku: (sku: string) => Promise<Product | null>
  findByEAN: (ean: string) => Promise<Product | null>
  findByBusinessId: (businessId: number) => Promise<ProductWithSupplier[]>
  findByBusinessIdAndSKU: (
    businessId: number,
    sku: string,
  ) => Promise<ProductWithSupplier | null>
  create: (data: CreateProductDTO) => Promise<Product>
  update: (id: number, data: UpdateProductDTO) => Promise<ProductWithSupplier>
  delete: (id: number) => Promise<Product>
}
