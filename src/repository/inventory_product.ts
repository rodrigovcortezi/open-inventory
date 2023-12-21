import type {InventoryProductWithProduct} from '~/models/inventory_product'

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
  ) => Promise<InventoryProductWithProduct | null>
  findByInventoryId: (
    inventoryId: number,
  ) => Promise<InventoryProductWithProduct[]>
  findByInventoryIdAndProductSupplier: (
    inventoryId: number,
    supplierId: number,
  ) => Promise<InventoryProductWithProduct[]>
  update: (
    id: number,
    data: UpdateInventoryProductDTO,
  ) => Promise<InventoryProductWithProduct>
}
