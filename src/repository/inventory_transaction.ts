import type {
  InventoryTransaction,
  InventoryTransactionWithItems,
  TransactionType,
} from '~/models/inventory_transaction'

type CreateInventoryTransactionItemDTO = {
  productId: number
  quantity: number
}

export type CreateInventoryTransactionDTO = {
  inventoryId: number
  userId?: number
  type: TransactionType
  items: CreateInventoryTransactionItemDTO[]
}

type ProductFilters = {
  sku?: string
  supplierId?: number
}

type DateFilters = {
  from?: Date
  to?: Date
}

export type TransactionFilters = {
  product?: ProductFilters
  date?: DateFilters
}

export interface InventoryTransactionRepository {
  create: (data: CreateInventoryTransactionDTO) => Promise<InventoryTransaction>
  findByInventoryId: (
    inventoryId: number,
    filters: TransactionFilters,
  ) => Promise<InventoryTransactionWithItems[]>
}
