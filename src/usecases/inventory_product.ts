import type {UserRepository} from '~/repository/user'
import type {InventoryRepository} from '~/repository/inventory'
import type {ProductRepository} from '~/repository/product'
import type {InventoryProductRepository} from '~/repository/inventory_product'
import {ServiceError} from './error'
import {
  safeInventoryWithProducts,
  type SafeInventoryWithProducts,
} from '~/models/inventory'
import {Role} from '~/models/user'
import type {InventoryProductWithProduct} from '~/models/inventory_product'
import type {InventoryTransactionRepository} from '~/repository/inventory_transaction'
import {TransactionType} from '~/models/inventory_transaction'

type InventoryProductServiceParams = {
  userRepository: UserRepository
  inventoryRepository: InventoryRepository
  productRepository: ProductRepository
  inventoryProductRepository: InventoryProductRepository
  inventoryTransactionRepository: InventoryTransactionRepository
}

type AdjustmentDTO = {
  variation: number
}

export type GetInventoryWithProductsUseCase = (
  loggedUserEmail: string,
  inventoryCode: string,
  productSku?: string,
) => Promise<SafeInventoryWithProducts>

export type AdjustProductStockUseCase = (
  loggedUserEmail: string,
  inventoryCode: string,
  productSku: string,
  adjustmentData: AdjustmentDTO,
) => Promise<SafeInventoryWithProducts>

export const createInventoryProductService = ({
  userRepository,
  inventoryRepository,
  productRepository,
  inventoryProductRepository,
  inventoryTransactionRepository,
}: InventoryProductServiceParams) => ({
  getInventoryWithProducts: async (
    loggedUserEmail: string,
    inventoryCode: string,
    productSku?: string,
  ) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN && authUser.role !== Role.SUPPLIER) {
      throw new ServiceError('User not allowed', 403)
    }

    const inventory = await inventoryRepository.findByCode(inventoryCode)
    if (!inventory || inventory.businessId !== authUser.businessId) {
      throw new ServiceError('Inventory not found', 404)
    }

    if (productSku) {
      const product = await productRepository.findByBusinessIdAndSKU(
        authUser.businessId,
        productSku,
      )
      if (!product) {
        throw new ServiceError('Product not found', 404)
      }

      const inventoryProduct =
        await inventoryProductRepository.findByInventoryIdAndProductId(
          inventory.id,
          product.id,
        )
      const inventoryWithProducts = {
        ...inventory,
        products: inventoryProduct ? [inventoryProduct] : [],
      }
      return safeInventoryWithProducts(inventoryWithProducts)
    }

    const inventoryProducts =
      await inventoryProductRepository.findByInventoryId(inventory.id)
    const inventoryWithProducts = {...inventory, products: inventoryProducts}
    return safeInventoryWithProducts(inventoryWithProducts)
  },
  adjustProductStock: async (
    loggedUserEmail: string,
    inventoryCode: string,
    productSku: string,
    adjustmentData: AdjustmentDTO,
  ) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const inventory = await inventoryRepository.findByCode(inventoryCode)
    if (!inventory || inventory.businessId !== authUser.businessId) {
      throw new ServiceError('Inventory not found', 404)
    }

    const product = await productRepository.findByBusinessIdAndSKU(
      authUser.businessId,
      productSku,
    )
    if (!product) {
      throw new ServiceError('Product not found', 404)
    }

    const inventoryProduct =
      await inventoryProductRepository.findByInventoryIdAndProductId(
        inventory.id,
        product.id,
      )

    const resultQuantity =
      (inventoryProduct?.quantity ?? 0) + adjustmentData.variation
    if (resultQuantity < 0) {
      throw new ServiceError(
        "A product's quantity in a inventory cannot be lower than zero",
        422,
      )
    }

    let changedInventoryProduct: InventoryProductWithProduct
    if (!inventoryProduct) {
      changedInventoryProduct = await inventoryProductRepository.create({
        inventoryId: inventory.id,
        productId: product.id,
        quantity: resultQuantity,
      })
    } else {
      changedInventoryProduct = await inventoryProductRepository.update(
        inventoryProduct.id,
        {quantity: resultQuantity},
      )
    }

    await inventoryTransactionRepository.create({
      inventoryId: inventory.id,
      userId: authUser.id,
      type: TransactionType.ADJUSTMENT,
      items: [
        {
          productId: product.id,
          quantity: adjustmentData.variation,
        },
      ],
    })

    const inventoryWithProducts = {
      ...inventory,
      products: [changedInventoryProduct],
    }
    return safeInventoryWithProducts(inventoryWithProducts)
  },
})
