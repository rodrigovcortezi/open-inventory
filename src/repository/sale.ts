import type {Sale, SaleStatus, SaleWithTransactions} from '~/models/sale'
import type {CreateInventoryTransactionDTO} from './inventory_transaction'

export type CreateSaleDTO = {
  external_id?: string
  status: SaleStatus
  inventoryId: number
  inventoryTransaction: CreateInventoryTransactionDTO
}

export interface SaleRepository {
  create: (data: CreateSaleDTO) => Promise<SaleWithTransactions>
  findByExternalId: (externalId: string) => Promise<Sale | null>
}
