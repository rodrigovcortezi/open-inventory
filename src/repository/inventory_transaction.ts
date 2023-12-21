import type {
  InventoryTransaction,
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

export interface InventoryTransactionRepository {
  create: (data: CreateInventoryTransactionDTO) => Promise<InventoryTransaction>
}
