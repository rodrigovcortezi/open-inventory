import type {Inventory} from './inventory'
import {
  InventoryTransactionWithItems,
  type SafeInventoryTransactionWithItems,
  safeInventoryTransactionWithItems,
} from './inventory_transaction'

export enum SupplyStatus {
  EXECUTED = 'EXECUTED',
  RETURNED = 'RETURNED',
}

export type Supply = {
  id: number
  external_id?: string | null
  status: SupplyStatus
  inventoryId: number
  createdAt: Date
  updatedAt: Date
}

export type SupplyWithTransactions = Supply & {
  transactions: InventoryTransactionWithItems[]
}

export type SupplyWithInventory = Supply & {
  inventory: Inventory
}

export type SupplyWithInventoryAndTransactions = SupplyWithTransactions &
  SupplyWithInventory

export type SafeSupply = Omit<Supply, 'inventoryId' | 'updatedAt'>

export type SafeSupplyWithTransactions = SafeSupply & {
  inventory: string
  movements: SafeInventoryTransactionWithItems[]
}

export type SafeSupplyWithInventory = SafeSupply & {
  inventory: string
}

export const safeSupply = (supply: Supply): SafeSupply => {
  const {id, external_id, status, createdAt} = supply
  return {id, external_id, status, createdAt}
}

export const safeSupplyWithTransactions = (
  supply: SupplyWithTransactions,
  inventory: string,
): SafeSupplyWithTransactions => {
  return {
    ...safeSupply(supply),
    inventory,
    movements: supply.transactions.map(t => ({
      ...safeInventoryTransactionWithItems(t),
    })),
  }
}

export const safeSupplyWithInventory = (
  supply: SupplyWithInventory,
): SafeSupplyWithInventory => {
  return {...safeSupply(supply), inventory: supply.inventory.code}
}
