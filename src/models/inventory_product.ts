import type {Inventory} from './inventory'
import type {Product} from './product'

export type InventoryProduct = {
  id: number
  inventoryId: number
  inventory: Inventory
  productId: number
  product: Product
  quantity: number
}

export type InventoryProductWithoutRelations = Omit<
  InventoryProduct,
  'inventory' | 'product'
>
