import type {
  Sale,
  SaleStatus,
  SaleWithInventory,
  SaleWithInventoryAndTransactions,
  SaleWithTransactions,
} from '~/models/sale'
import type {CreateInventoryTransactionDTO} from './inventory_transaction'

export type CreateSaleDTO = {
  external_id?: string
  status: SaleStatus
  inventoryId: number
  inventoryTransaction: CreateInventoryTransactionDTO
}

export type ReturnSaleDTO = {
  status: SaleStatus
  inventoryTransaction: CreateInventoryTransactionDTO
}

export type SaleFilters = {
  inventoryCode?: string
  fromDate?: Date
  toDate?: Date
}

export interface SaleRepository {
  create: (data: CreateSaleDTO) => Promise<SaleWithTransactions>
  return: (
    id: number,
    data: ReturnSaleDTO,
  ) => Promise<SaleWithInventoryAndTransactions>
  findById: (id: number) => Promise<SaleWithInventoryAndTransactions | null>
  findByExternalId: (externalId: string) => Promise<Sale | null>
  findByBusinessId: (
    businessId: number,
    filters: SaleFilters,
  ) => Promise<SaleWithInventory[]>
}
