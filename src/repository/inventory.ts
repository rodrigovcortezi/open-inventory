import type {Inventory} from '~/models/inventory'

export type CreateInventoryDTO = {
  name: string
  code: string
  businessId: number
}

export type UpdateInventoryDTO = {
  name?: string
}

export interface InventoryRepository {
  findById: (id: number) => Promise<Inventory | null>
  create: (data: CreateInventoryDTO) => Promise<Inventory>
  findByCode: (code: string) => Promise<Inventory | null>
  findByBusinessId: (businessId: number) => Promise<Inventory[]>
  update: (id: number, data: UpdateInventoryDTO) => Promise<Inventory>
  delete: (id: number) => Promise<Inventory>
}
