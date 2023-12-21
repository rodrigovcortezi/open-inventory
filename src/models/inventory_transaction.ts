export enum TransactionType {
  ADJUSTMENT = 'ADJUSTMENT',
  SALE = 'SALE',
  SUPPLY = 'SUPPLY',
  SALE_RETURN = 'SALE_RETURN',
  SUPPLY_RETURN = 'SUPPLY_RETURN',
}

export type InventoryTransaction = {
  id: number
  inventoryId: number
  userId?: number | null
  type: TransactionType
  createdAt: Date
  updatedAt: Date
}

export type InventoryTransactionItem = {
  inventoryTransactionId: number
  productId: number
  quantity: number
}
