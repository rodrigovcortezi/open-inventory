import type {Inventory} from './inventory'
import type {Product} from './product'

export type InventoryProduct = {
  id: number
  inventoryId: number
  productId: number
  quantity: number
}

export type InventoryProductWithProduct = InventoryProduct & {
  product: Product
}

export type InventoryProductWithInventory = InventoryProduct & {
  inventory: Inventory
}

export type SafeInventoryProduct = Pick<InventoryProduct, 'quantity'> & {
  sku: string
}

export const safeInventoryProduct = (
  inventoryProduct: InventoryProductWithProduct,
): SafeInventoryProduct => {
  const {quantity, product} = inventoryProduct
  return {quantity, sku: product.sku}
}
