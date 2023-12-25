import type {UserRepository} from '~/repository/user'
import type {InventoryRepository} from '~/repository/inventory'
import {
  SupplyStatus,
  safeSupplyWithTransactions,
  safeSupplyWithInventory,
  type SafeSupplyWithInventory,
  SafeSupplyWithTransactions,
} from '~/models/supply'
import {ServiceError} from './error'
import {Role} from '~/models/user'
import type {ProductRepository} from '~/repository/product'
import type {CreateInventoryTransactionItemDTO} from '~/repository/inventory_transaction'
import type {SupplyRepository} from '~/repository/supply'
import {TransactionType} from '~/models/inventory_transaction'

type SupplyServiceParams = {
  userRepository: UserRepository
  inventoryRepository: InventoryRepository
  productRepository: ProductRepository
  supplyRepository: SupplyRepository
}

type SupplyItemDTO = {
  sku: string
  quantity: number
}

type RegisterSupplyDTO = {
  externalID: string
  inventory: string
  items: SupplyItemDTO[]
}

type GetAllSuppliesOptions = {
  inventoryCode?: string
  fromDate?: Date
  toDate?: Date
}

export type RegisterSupplyUseCase = (
  loggedUserEmail: string,
  supplyData: RegisterSupplyDTO,
) => Promise<SafeSupplyWithTransactions>

export type GetAllSuppliesUseCase = (
  loggedUserEmail: string,
  options: GetAllSuppliesOptions,
) => Promise<SafeSupplyWithInventory[]>

export type ReturnSupplyUseCase = (
  loggedUserEmail: string,
  id: number,
) => Promise<SafeSupplyWithTransactions>

export type GetSupplyUseCase = (
  loggedUserEmail: string,
  id: number,
) => Promise<SafeSupplyWithTransactions>

export const createSupplyService = ({
  userRepository,
  inventoryRepository,
  productRepository,
  supplyRepository,
}: SupplyServiceParams) => ({
  registerSupply: async (
    loggedUserEmail: string,
    supplyData: RegisterSupplyDTO,
  ) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.SUPPLIER) {
      throw new ServiceError('User not allowed', 403)
    }

    const inventory = await inventoryRepository.findByCode(supplyData.inventory)
    if (!inventory || inventory.businessId !== authUser.businessId) {
      throw new ServiceError('Inventory not found', 404)
    }

    if (supplyData.externalID) {
      const supplyExists = Boolean(
        await supplyRepository.findByExternalId(supplyData.externalID),
      )
      if (supplyExists) {
        throw new ServiceError(
          'A supply with the same external id is already registered',
          422,
        )
      }
    }

    const transactionItems: CreateInventoryTransactionItemDTO[] = []

    for (const item of supplyData.items) {
      const product = await productRepository.findByBusinessIdAndSKU(
        authUser.businessId,
        item.sku,
      )
      if (!product) {
        throw new ServiceError('Product not found', 404)
      }

      transactionItems.push({
        productId: product.id,
        quantity: item.quantity,
      })
    }

    const supply = await supplyRepository.create({
      external_id: supplyData.externalID,
      status: SupplyStatus.EXECUTED,
      inventoryId: inventory.id,
      inventoryTransaction: {
        inventoryId: inventory.id,
        userId: authUser.id,
        type: TransactionType.SUPPLY,
        items: transactionItems,
      },
    })

    return safeSupplyWithTransactions(supply, inventory.code)
  },
  getAllSupplies: async (
    loggedUserEmail: string,
    options: GetAllSuppliesOptions,
  ) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const supplies = await supplyRepository.findByBusinessId(
      authUser.businessId,
      options,
    )

    return supplies.map(s => safeSupplyWithInventory(s))
  },
  returnSupply: async (loggedUserEmail: string, supplyId: number) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.SUPPLIER) {
      throw new ServiceError('User not allowed', 403)
    }

    const supply = await supplyRepository.findById(supplyId)
    if (!supply || supply.inventory.businessId !== authUser.businessId) {
      throw new ServiceError('Supply not found', 404)
    }

    if (supply.status !== SupplyStatus.EXECUTED) {
      throw new ServiceError(
        'Supply must be in executed status to be returned',
        422,
      )
    }

    const transactionItems: CreateInventoryTransactionItemDTO[] = []
    for (const item of supply.transactions[0].items) {
      transactionItems.push({
        productId: item.product.id,
        quantity: -1 * item.quantity,
      })
    }

    const returnedSupply = await supplyRepository.return(supply.id, {
      status: SupplyStatus.RETURNED,
      inventoryTransaction: {
        inventoryId: supply.inventoryId,
        userId: authUser.id,
        type: TransactionType.SUPPLY_RETURN,
        items: transactionItems,
      },
    })

    return safeSupplyWithTransactions(
      returnedSupply,
      returnedSupply.inventory.code,
    )
  },
  getSupply: async (loggedUserEmail: string, id: number) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const supply = await supplyRepository.findById(id)
    if (!supply || supply.inventory.businessId !== authUser.businessId) {
      throw new ServiceError('Supply not found', 404)
    }

    return safeSupplyWithTransactions(supply, supply.inventory.code)
  },
})
