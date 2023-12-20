import type {Supplier} from './supplier'

export type Product = {
  id: number
  name: string
  description?: string | null
  sku: string
  ean?: string | null
  supplierId: number
  businessId: number
}

export type ProductWithSupplier = Product & {
  supplier: Supplier
}

export type SafeProduct = Omit<Product, 'id' | 'supplierId' | 'businessId'>

export type SafeProductWithSupplierCode = SafeProduct & {
  supplierCode: string
}

export const safeProduct = (product: Product): SafeProduct => {
  const {name, description, sku, ean} = product
  return {name, description, sku, ean}
}
