import type {
  InventoryProduct,
  InventoryProductWithProduct,
} from '~/models/inventory_product'

export type CreateInventoryProductDTO = {
  inventoryId: number
  productId: number
  quantity: number
}

export type UpdateInventoryProductDTO = {
  quantity: number
}

export interface InventoryProductRepository {
  create: (
    data: CreateInventoryProductDTO,
  ) => Promise<InventoryProductWithProduct>
  findByInventoryIdAndProductId: (
    inventoryId: number,
    productId: number,
  ) => Promise<InventoryProduct | null>
  findByInventoryId: (
    inventoryId: number,
  ) => Promise<InventoryProductWithProduct[]>
  update: (
    id: number,
    data: UpdateInventoryProductDTO,
  ) => Promise<InventoryProductWithProduct>
}
