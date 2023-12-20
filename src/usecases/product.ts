import {safeProduct, type SafeProductWithSupplierCode} from '~/models/product'
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
  supplierCode?: string
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
  sku: string,
  productData: UpdateProductDTO,
) => Promise<SafeProductWithSupplierCode>

export type DeleteProductUseCase = (
  loggedUserEmail: string,
  sku: string,
) => Promise<SafeProductWithSupplierCode>

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
    sku: string,
    productData: UpdateProductDTO,
  ) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const product = await productRepository.findByBusinessIdAndSKU(
      authUser.businessId,
      sku,
    )
    if (!product) {
      throw new ServiceError('Product not found', 404)
    }

    if (productData.sku && productData.sku !== product.sku) {
      const productExists = Boolean(
        await productRepository.findByBusinessIdAndSKU(
          authUser.businessId,
          product.sku,
        ),
      )
      if (productExists) {
        throw new ServiceError('SKU is already in use', 422)
      }
    }

    if (productData.ean && productData.ean !== product.ean) {
      const productExists = Boolean(
        await productRepository.findByEAN(productData.ean),
      )
      if (productExists) {
        throw new ServiceError('EAN is already in use', 422)
      }
    }

    let supplierId
    if (
      productData.supplierCode &&
      productData.supplierCode !== product.supplier.code
    ) {
      const supplier = await supplierRepository.findByCode(
        productData.supplierCode,
      )
      if (!supplier) {
        throw new ServiceError('Supplier not found', 404)
      }
      supplierId = supplier.id
    }

    const changedProduct = await productRepository.update(product.id, {
      name: productData.name,
      description: productData.description,
      sku: productData.sku,
      ean: productData.ean,
      supplierId: supplierId,
    })

    return {
      ...safeProduct(changedProduct),
      supplierCode: changedProduct.supplier.code,
    }
  },
  deleteProduct: async (loggedUserEmail: string, sku: string) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const product = await productRepository.findByBusinessIdAndSKU(
      authUser.businessId,
      sku,
    )
    if (!product) {
      throw new ServiceError('Product not found', 404)
    }

    await productRepository.delete(product.id)

    return {...safeProduct(product), supplierCode: product.supplier.code}
  },
})
