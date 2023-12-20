export type Product = {
  id: number
  name: string
  description?: string | null
  sku: string
  ean?: string | null
  supplierId: number
  businessId: number
}

export type SafeProduct = Omit<Product, 'id' | 'supplierId' | 'businessId'>

export type SafeProductWithSupplierCode = SafeProduct & {
  supplierCode: string
}

export const safeProduct = (product: Product) => {
  const {name, description, sku, ean} = product
  return {name, description, sku, ean}
}
