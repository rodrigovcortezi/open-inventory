import {Supplier} from '~/models/supplier'
import {SupplierRepository} from '~/repository/supplier'
import {UniqueCharOTP} from 'unique-string-generator'
import {UserRepository} from '~/repository/user'
import {ServiceError} from './error'

type SupplierServiceParams = {
  userRepository: UserRepository
  supplierRepository: SupplierRepository
}

type RegisterSupplierDTO = {
  name: string
}

export type RegisterSupplierUseCase = (
  loggedUserEmail: string,
  supplierData: RegisterSupplierDTO,
) => Promise<Supplier>

export const createSupplierService = ({
  userRepository,
  supplierRepository,
}: SupplierServiceParams) => ({
  registerSupplier: async (
    loggedUserEmail: string,
    supplierData: RegisterSupplierDTO,
  ) => {
    const user = await userRepository.findByEmail(loggedUserEmail)
    if (!user) {
      throw new ServiceError('User not found.', 404)
    }

    const supplier = await supplierRepository.create({
      ...supplierData,
      code: UniqueCharOTP(5),
      businessId: user.business.id as number,
    })
    return supplier
  },
})
