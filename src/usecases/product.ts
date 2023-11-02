import type {Product} from '~/models/product'
import type {ProductRepository} from '~/repository/product'
import type {UserRepository} from '~/repository/user'
import {ServiceError} from './error'

type ProductServiceParams = {
  userRepository: UserRepository
  productRepository: ProductRepository
}

type RegisterProductDTO = {
  name: string
  description?: string
  sku: string
  ean: string
}

export type RegisterProductUseCase = (
  loggedUserEmail: string,
  productData: RegisterProductDTO,
) => Promise<Product>

export const createProductService = ({
  userRepository,
  productRepository,
}: ProductServiceParams) => ({
  registerProduct: async (
    loggedUserEmail: string,
    productData: RegisterProductDTO,
  ) => {
    const user = await userRepository.findByEmail(loggedUserEmail)
    if (!user) {
      throw new ServiceError('User not found', 404)
    }

    const product = await productRepository.create({
      ...productData,
      businessId: user.business.id as number,
    })

    return product
  },
})
