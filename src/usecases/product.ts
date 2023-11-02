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

type UpdateProductDTO = {
  name?: string
  description?: string
  sku?: string
  ean?: string
}

export type RegisterProductUseCase = (
  loggedUserEmail: string,
  productData: RegisterProductDTO,
) => Promise<Product>

export type UpdateProductUseCase = (
  loggedUserEmail: string,
  id: number,
  productData: UpdateProductDTO,
) => Promise<Product>

export type DeleteProductUseCase = (
  loggedUserEmail: string,
  id: number,
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
  updateProduct: async (
    loggedUserEmail: string,
    id: number,
    productData: UpdateProductDTO,
  ) => {
    const user = await userRepository.findByEmail(loggedUserEmail)
    if (!user) {
      throw new ServiceError('User not found', 404)
    }

    const product = await productRepository.findById(id)
    if (!product) {
      throw new ServiceError('Product not found', 404)
    }

    if (user.business.id !== product.business.id) {
      throw new ServiceError('Product does not belong to user business', 403)
    }

    const changedProduct = await productRepository.update(id, productData)

    return changedProduct
  },
  deleteProduct: async (loggedUserEmail: string, id: number) => {
    const user = await userRepository.findByEmail(loggedUserEmail)
    if (!user) {
      throw new ServiceError('User not found', 404)
    }

    const product = await productRepository.findById(id)
    if (!product) {
      throw new ServiceError('Product not found', 404)
    }

    if (user.business.id !== product.business.id) {
      throw new ServiceError('Product does not belong to user business', 403)
    }

    await productRepository.delete(id)

    return product
  },
})
