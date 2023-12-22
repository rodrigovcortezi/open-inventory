import type {Inventory} from './inventory'
import {
  InventoryTransactionWithItems,
  type SafeInventoryTransactionWithItems,
  safeInventoryTransactionWithItems,
} from './inventory_transaction'

export enum SaleStatus {
  EXECUTED = 'EXECUTED',
  RETURNED = 'RETURNED',
}

export type Sale = {
  id: number
  external_id?: string | null
  status: SaleStatus
  inventoryId: number
  createdAt: Date
  updatedAt: Date
}

export type SaleWithTransactions = Sale & {
  transactions: InventoryTransactionWithItems[]
}

export type SaleWithInventory = Sale & {
  inventory: Inventory
}

export type SaleWithInventoryAndTransactions = SaleWithTransactions &
  SaleWithInventory

export type SafeSale = Omit<Sale, 'inventoryId' | 'updatedAt'>

export type SafeSaleWithTransactions = SafeSale & {
  inventory: string
  movements: SafeInventoryTransactionWithItems[]
}

export type SafeSaleWithInventory = SafeSale & {
  inventory: string
}

export const safeSale = (sale: Sale): SafeSale => {
  const {id, external_id, status, createdAt} = sale
  return {id, external_id, status, createdAt}
}

export const safeSaleWithTransactions = (
  sale: SaleWithTransactions,
  inventory: string,
): SafeSaleWithTransactions => {
  return {
    ...safeSale(sale),
    inventory,
    movements: sale.transactions.map(t => ({
      ...safeInventoryTransactionWithItems(t),
    })),
  }
}

export const safeSaleWithInventory = (
  sale: SaleWithInventory,
): SafeSaleWithInventory => {
  return {...safeSale(sale), inventory: sale.inventory.code}
}
