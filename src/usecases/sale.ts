import type {UserRepository} from '~/repository/user'
import type {InventoryRepository} from '~/repository/inventory'
import {
  SaleStatus,
  type SafeSale,
  safeSaleWithTransactions,
} from '~/models/sale'
import {ServiceError} from './error'
import {Role} from '~/models/user'
import type {ProductRepository} from '~/repository/product'
import type {InventoryProductRepository} from '~/repository/inventory_product'
import type {CreateInventoryTransactionItemDTO} from '~/repository/inventory_transaction'
import type {SaleRepository} from '~/repository/sale'
import {TransactionType} from '~/models/inventory_transaction'

type SaleServiceParams = {
  userRepository: UserRepository
  inventoryRepository: InventoryRepository
  productRepository: ProductRepository
  inventoryProductRepository: InventoryProductRepository
  saleRepository: SaleRepository
}

type SaleItemDTO = {
  sku: string
  quantity: number
}

type RegisterSaleDTO = {
  externalID: string
  inventory: string
  items: SaleItemDTO[]
}

export type RegisterSaleUseCase = (
  loggedUserEmail: string,
  saleData: RegisterSaleDTO,
) => Promise<SafeSale>

export const createSaleService = ({
  userRepository,
  inventoryRepository,
  productRepository,
  inventoryProductRepository,
  saleRepository,
}: SaleServiceParams) => ({
  registerSale: async (loggedUserEmail: string, saleData: RegisterSaleDTO) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.STORE) {
      throw new ServiceError('User not allowed', 403)
    }

    const inventory = await inventoryRepository.findByCode(saleData.inventory)
    if (!inventory || inventory.businessId !== authUser.businessId) {
      throw new ServiceError('Inventory not found', 404)
    }

    if (saleData.externalID) {
      const saleExists = Boolean(
        await saleRepository.findByExternalId(saleData.externalID),
      )
      if (saleExists) {
        throw new ServiceError(
          'A sale with the same external id is already registered',
          422,
        )
      }
    }

    const transactionItems: CreateInventoryTransactionItemDTO[] = []

    for (const item of saleData.items) {
      const product = await productRepository.findByBusinessIdAndSKU(
        authUser.businessId,
        item.sku,
      )
      if (!product) {
        throw new ServiceError('Product not found', 404)
      }

      const inventoryProduct =
        await inventoryProductRepository.findByInventoryIdAndProductId(
          inventory.id,
          product.id,
        )
      if (!inventoryProduct || inventoryProduct.quantity < item.quantity) {
        throw new ServiceError('Some product quantity is not available', 422)
      }

      transactionItems.push({
        productId: product.id,
        quantity: item.quantity,
      })
    }

    const sale = await saleRepository.create({
      external_id: saleData.externalID,
      status: SaleStatus.EXECUTED,
      inventoryId: inventory.id,
      inventoryTransaction: {
        inventoryId: inventory.id,
        userId: authUser.id,
        type: TransactionType.SALE,
        items: transactionItems,
      },
    })

    return safeSaleWithTransactions(sale, inventory.code)
  },
})
