import {safeBusiness, type Business, type SafeBusiness} from './business'

export type Supplier = {
  id: number
  name: string
  code: string
  cnpj: string
  businessId: number
}

export type SupplierWithBusiness = Supplier & {
  business: Business
}

export type SafeSupplier = Omit<Supplier, 'id' | 'businessId'>

export type SafeSupplierWithBusiness = SafeSupplier & {
  business: SafeBusiness
}

export const safeSupplier = (supplier: Supplier): SafeSupplier => {
  const {name, code, cnpj} = supplier
  return {name, code, cnpj}
}

export const safeSupplierWithBusiness = (
  supplierWithBusiness: SupplierWithBusiness,
): SafeSupplierWithBusiness => {
  const {name, code, cnpj, business} = supplierWithBusiness
  return {name, code, cnpj, business: safeBusiness(business)}
}
