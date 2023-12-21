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
import {
  type SafeInventoryTransactionWithItems,
  safeInventoryTransactionWithItems,
  TransactionType,
} from '~/models/inventory_transaction'
import {type SafeProductWithInventories, safeProduct} from '~/models/product'

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

type GetInventoryTransactionsOptions = {
  productSku?: string
  fromDate?: Date
  toDate?: Date
}

export type GetProductWithAllInventoriesUseCase = (
  loggedUserEmail: string,
  productSku: string,
) => Promise<SafeProductWithInventories>

export type GetInventoryWithProductsUseCase = (
  loggedUserEmail: string,
  inventoryCode: string,
  productSku?: string,
) => Promise<SafeInventoryWithProducts>

export type GetInventoryTransactionsUseCase = (
  loggedUserEmail: string,
  inventoryCode: string,
  options: GetInventoryTransactionsOptions,
) => Promise<SafeInventoryTransactionWithItems[]>

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
  getProductWithAllInventories: async (
    loggedUserEmail: string,
    productSku: string,
  ) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN && authUser.role !== Role.SUPPLIER) {
      throw new ServiceError('User not allowed', 403)
    }

    const product = await productRepository.findByBusinessIdAndSKU(
      authUser.businessId,
      productSku,
    )
    if (
      !product ||
      (authUser.role === Role.SUPPLIER &&
        product.supplierId !== authUser.supplierId)
    ) {
      throw new ServiceError('Product not found', 404)
    }

    const inventoryProducts = await inventoryProductRepository.findByProductId(
      product.id,
    )

    const productWithInventories = {
      ...safeProduct(product),
      supplierCode: product.supplier.code,
      inventories: inventoryProducts.map(p => ({
        inventory: p.inventory.code,
        quantity: p.quantity,
      })),
    }
    return productWithInventories
  },
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
      if (
        !product ||
        (authUser.role === Role.SUPPLIER &&
          product.supplierId !== authUser.supplierId)
      ) {
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

    if (authUser.role === Role.SUPPLIER) {
      const inventoryProducts =
        await inventoryProductRepository.findByInventoryIdAndProductSupplier(
          inventory.id,
          authUser.supplierId as number,
        )
      const inventoryWithProducts = {...inventory, products: inventoryProducts}
      return safeInventoryWithProducts(inventoryWithProducts)
    }

    const inventoryProducts =
      await inventoryProductRepository.findByInventoryId(inventory.id)
    const inventoryWithProducts = {...inventory, products: inventoryProducts}
    return safeInventoryWithProducts(inventoryWithProducts)
  },
  getInventoryTransactions: async (
    loggedUserEmail: string,
    inventoryCode: string,
    options: GetInventoryTransactionsOptions,
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

    const filters = {
      product: {
        sku: options.productSku,
        supplierId: undefined as number | undefined,
      },
      date: {
        from: options.fromDate,
        to: options.toDate,
      },
    }

    if (authUser.role === Role.SUPPLIER) {
      filters.product.supplierId = authUser.supplierId as number
    }

    const transactions = await inventoryTransactionRepository.findByInventoryId(
      inventory.id,
      filters,
    )

    return transactions.map(t => safeInventoryTransactionWithItems(t))
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
