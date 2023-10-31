import {Supplier} from '~/models/supplier'

export type CreateSupplierDTO = {
  name: string
  code: string
  businessId: number
}

export interface SupplierRepository {
  create: (data: CreateSupplierDTO) => Promise<Supplier>
}
