import type {InventoryProductWithoutRelations} from '~/models/inventory_product'

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
  ) => Promise<InventoryProductWithoutRelations>
  findByProductId: (
    productId: number,
  ) => Promise<InventoryProductWithoutRelations | null>
  update: (
    id: number,
    data: UpdateInventoryProductDTO,
  ) => Promise<InventoryProductWithoutRelations>
}
