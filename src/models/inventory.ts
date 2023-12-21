import {
  safeInventoryProduct,
  type SafeInventoryProduct,
  type InventoryProductWithProduct,
} from './inventory_product'

export type Inventory = {
  id: number
  name: string
  code: string
  businessId: number
}

export type InventoryWithProducts = Inventory & {
  products: InventoryProductWithProduct[]
}

export type SafeInventory = Omit<Inventory, 'id' | 'businessId'>

export type SafeInventoryWithProducts = SafeInventory & {
  products: SafeInventoryProduct[]
}

export const safeInventory = (inventory: Inventory): SafeInventory => {
  const {name, code} = inventory
  return {name, code}
}

export const safeInventoryWithProducts = (
  inventory: InventoryWithProducts,
): SafeInventoryWithProducts => {
  const {name, code, products} = inventory
  return {name, code, products: products.map(p => safeInventoryProduct(p))}
}
