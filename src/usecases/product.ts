import {
  safeProduct,
  type Product,
  type SafeProductWithSupplierCode,
} from '~/models/product'
import type {ProductRepository} from '~/repository/product'
import type {UserRepository} from '~/repository/user'
import {ServiceError} from './error'
import {Role} from '~/models/user'
import type {SupplierRepository} from '~/repository/supplier'

type ProductServiceParams = {
  userRepository: UserRepository
  productRepository: ProductRepository
  supplierRepository: SupplierRepository
}

type RegisterProductDTO = {
  name: string
  description?: string
  sku: string
  ean: string
  supplierCode: string
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
) => Promise<SafeProductWithSupplierCode>

export type GetAllProductsUseCase = (
  loggedUserEmail: string,
) => Promise<SafeProductWithSupplierCode[]>

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
  supplierRepository,
}: ProductServiceParams) => ({
  registerProduct: async (
    loggedUserEmail: string,
    productData: RegisterProductDTO,
  ) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const supplier = await supplierRepository.findByCode(
      productData.supplierCode,
    )
    if (!supplier || supplier.businessId !== authUser.businessId) {
      throw new ServiceError('Supplier not found', 404)
    }

    if (productData.ean) {
      const productExists = Boolean(
        await productRepository.findByEAN(productData.ean),
      )
      if (productExists) {
        throw new ServiceError('EAN is already in use', 422)
      }
    }

    const productExists = Boolean(
      await productRepository.findByBusinessIdAndSKU(
        authUser.businessId,
        productData.sku,
      ),
    )
    if (productExists) {
      throw new ServiceError('SKU is already in use', 422)
    }

    const product = await productRepository.create({
      name: productData.name,
      description: productData.description,
      sku: productData.sku,
      ean: productData.ean,
      supplierId: supplier.id,
      businessId: authUser.businessId,
    })

    return {...safeProduct(product), supplierCode: supplier.code}
  },
  getAllProducts: async (loggedUserEmail: string) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const products = await productRepository.findByBusinessId(
      authUser.businessId,
    )
    return products.map(p => ({
      ...safeProduct(p),
      supplierCode: p.supplier.code,
    }))
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

    if (user.business.id !== product.businessId) {
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

    if (user.business.id !== product.businessId) {
      throw new ServiceError('Product does not belong to user business', 403)
    }

    await productRepository.delete(id)

    return product
  },
})
