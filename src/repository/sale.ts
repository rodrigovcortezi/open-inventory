import type {
  Sale,
  SaleStatus,
  SaleWithInventory,
  SaleWithTransactions,
} from '~/models/sale'
import type {CreateInventoryTransactionDTO} from './inventory_transaction'

export type CreateSaleDTO = {
  external_id?: string
  status: SaleStatus
  inventoryId: number
  inventoryTransaction: CreateInventoryTransactionDTO
}

export type SaleFilters = {
  inventoryCode?: string
  fromDate?: Date
  toDate?: Date
}

export interface SaleRepository {
  create: (data: CreateSaleDTO) => Promise<SaleWithTransactions>
  findByExternalId: (externalId: string) => Promise<Sale | null>
  findByBusinessId: (
    businessId: number,
    filters: SaleFilters,
  ) => Promise<SaleWithInventory[]>
}
