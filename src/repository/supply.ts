import type {
  Supply,
  SupplyStatus,
  SupplyWithInventory,
  SupplyWithInventoryAndTransactions,
  SupplyWithTransactions,
} from '~/models/supply'
import type {CreateInventoryTransactionDTO} from './inventory_transaction'

export type CreateSupplyDTO = {
  external_id?: string
  status: SupplyStatus
  inventoryId: number
  inventoryTransaction: CreateInventoryTransactionDTO
}

export type ReturnSupplyDTO = {
  status: SupplyStatus
  inventoryTransaction: CreateInventoryTransactionDTO
}

export type SupplyFilters = {
  inventoryCode?: string
  fromDate?: Date
  toDate?: Date
}

export interface SupplyRepository {
  create: (data: CreateSupplyDTO) => Promise<SupplyWithTransactions>
  return: (
    id: number,
    data: ReturnSupplyDTO,
  ) => Promise<SupplyWithInventoryAndTransactions>
  findById: (id: number) => Promise<SupplyWithInventoryAndTransactions | null>
  findByExternalId: (externalId: string) => Promise<Supply | null>
  findByBusinessId: (
    businessId: number,
    filters: SupplyFilters,
  ) => Promise<SupplyWithInventory[]>
}
