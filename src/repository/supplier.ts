import {Supplier} from '~/models/supplier'

export type CreateSupplierDTO = {
  name: string
  code: string
  businessId: number
}

export interface SupplierRepository {
  findById: (id: number) => Promise<Supplier | null>
  findByCode: (code: string) => Promise<Supplier | null>
  create: (data: CreateSupplierDTO) => Promise<Supplier>
  delete: (id: number) => Promise<Supplier>
}
