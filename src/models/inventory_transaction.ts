import {type Product} from './product'

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
  saleId?: number | null
  type: TransactionType
  createdAt: Date
  updatedAt: Date
}

type InventoryTransactionItem = {
  inventoryTransactionId: number
  productId: number
  quantity: number
}

type InventoryTransactionItemWithProduct = InventoryTransactionItem & {
  product: Product
}

export type InventoryTransactionWithItems = InventoryTransaction & {
  items: InventoryTransactionItemWithProduct[]
}

type SafeInventoryTransaction = Omit<
  InventoryTransaction,
  'id' | 'inventoryId' | 'userId' | 'saleId' | 'updatedAt'
>

type SafeInventoryTransactionItem = Omit<
  InventoryTransactionItem,
  'inventoryTransactionId' | 'productId'
>

type SafeInventoryTransactionItemWithProduct = SafeInventoryTransactionItem & {
  sku: string
}

export type SafeInventoryTransactionWithItems = SafeInventoryTransaction & {
  items: SafeInventoryTransactionItemWithProduct[]
}

const safeInventoryTransactionItem = (
  transactionItem: InventoryTransactionItemWithProduct,
): SafeInventoryTransactionItemWithProduct => {
  const {product, quantity} = transactionItem
  return {sku: product.sku, quantity}
}

export const safeInventoryTransactionWithItems = (
  transactionWithItems: InventoryTransactionWithItems,
): SafeInventoryTransactionWithItems => {
  const {type, items, createdAt} = transactionWithItems
  return {
    type,
    items: items.map(i => safeInventoryTransactionItem(i)),
    createdAt,
  }
}
