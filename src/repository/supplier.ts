import type {Supplier, SupplierWithBusiness} from '~/models/supplier'

export type CreateSupplierDTO = {
  name: string
  code: string
  cnpj: string
  businessId: number
}

export type UpdateSupplierDTO = {
  name?: string
  cnpj?: string
}

export interface SupplierRepository {
  findByBusinessId: (businessId: number) => Promise<Supplier[]>
  findById: (id: number) => Promise<SupplierWithBusiness | null>
  findByCode: (code: string) => Promise<SupplierWithBusiness | null>
  findByCNPJ: (cnpj: string) => Promise<SupplierWithBusiness | null>
  create: (data: CreateSupplierDTO) => Promise<SupplierWithBusiness>
  update: (
    code: string,
    supplierData: UpdateSupplierDTO,
  ) => Promise<SupplierWithBusiness>
  delete: (id: number) => Promise<SupplierWithBusiness>
}
