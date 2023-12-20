import type {SupplierWithBusiness} from '~/models/supplier'

export type CreateSupplierDTO = {
  name: string
  code: string
  cnpj: string
  businessId: number
}

export interface SupplierRepository {
  findById: (id: number) => Promise<SupplierWithBusiness | null>
  findByCode: (code: string) => Promise<SupplierWithBusiness | null>
  findByCNPJ: (cnpj: string) => Promise<SupplierWithBusiness | null>
  create: (data: CreateSupplierDTO) => Promise<SupplierWithBusiness>
  delete: (id: number) => Promise<SupplierWithBusiness>
}
