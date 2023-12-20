import {
  type SafeSupplier,
  safeSupplierWithBusiness,
  type SafeSupplierWithBusiness,
  type Supplier,
  safeSupplier,
} from '~/models/supplier'
import {SupplierRepository} from '~/repository/supplier'
import {UniqueCharOTP} from 'unique-string-generator'
import {UserRepository} from '~/repository/user'
import {ServiceError} from './error'
import {Role} from '~/models/user'

type SupplierServiceParams = {
  userRepository: UserRepository
  supplierRepository: SupplierRepository
}

type RegisterSupplierDTO = {
  name: string
  cnpj: string
}

type UpdateSupplierDTO = {
  name?: string
  cnpj?: string
}

export type RegisterSupplierUseCase = (
  loggedUserEmail: string,
  supplierData: RegisterSupplierDTO,
) => Promise<SafeSupplierWithBusiness>

export type UpdateSupplierUseCase = (
  loggedUserEmail: string,
  supplierCode: string,
  supplierData: UpdateSupplierDTO,
) => Promise<SafeSupplierWithBusiness>

export type GetAllBusinessSuppliersUseCase = (
  loggedUserEmail: string,
) => Promise<SafeSupplier[]>

export type DeleteSupplierUseCase = (
  loggedUserEmail: string,
  id: number,
) => Promise<Supplier>

export const createSupplierService = ({
  userRepository,
  supplierRepository,
}: SupplierServiceParams) => ({
  registerSupplier: async (
    loggedUserEmail: string,
    supplierData: RegisterSupplierDTO,
  ) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found.', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const supplierExists = Boolean(
      await supplierRepository.findByCNPJ(supplierData.cnpj),
    )
    if (supplierExists) {
      throw new ServiceError('CNPJ is already in use', 422)
    }

    let supplierCode = null
    while (supplierCode === null) {
      const code = UniqueCharOTP(5)
      const supplierExists = Boolean(await supplierRepository.findByCode(code))
      if (!supplierExists) {
        supplierCode = code
      }
    }

    const supplier = await supplierRepository.create({
      ...supplierData,
      code: supplierCode,
      businessId: authUser.business.id as number,
    })
    return safeSupplierWithBusiness(supplier)
  },
  updateSupplier: async (
    loggedUserEmail: string,
    supplierCode: string,
    supplierData: UpdateSupplierDTO,
  ) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const supplier = await supplierRepository.findByCode(supplierCode)
    if (!supplier) {
      throw new ServiceError('Supplier not found', 404)
    }

    if (supplierData.cnpj && supplierData.cnpj !== supplier.cnpj) {
      const supplierExists = Boolean(
        await supplierRepository.findByCNPJ(supplierData.cnpj),
      )
      if (supplierExists) {
        throw new ServiceError('CNPJ is already in use', 422)
      }
    }

    const changedSupplier = await supplierRepository.update(
      supplierCode,
      supplierData,
    )
    return safeSupplierWithBusiness(changedSupplier)
  },
  getAllBusinessSuppliers: async (loggedUserEmail: string) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const suppliers = await supplierRepository.findByBusinessId(
      authUser.businessId,
    )
    return suppliers.map(s => safeSupplier(s))
  },
  deleteSupplier: async (loggedUserEmail: string, id: number) => {
    const user = await userRepository.findByEmail(loggedUserEmail)
    if (!user) {
      throw new ServiceError('User not found.', 404)
    }

    const supplier = await supplierRepository.findById(id)
    if (!supplier) {
      throw new ServiceError('Supplier not found', 404)
    }

    if (user.business.id !== supplier.business.id) {
      throw new ServiceError('Supplier belongs to other business', 403)
    }

    await supplierRepository.delete(id)

    return supplier
  },
})
