import type {UserRepository} from '~/repository/user'
import type {InventoryRepository} from '~/repository/inventory'
import {ServiceError} from './error'
import {UniqueCharOTP} from 'unique-string-generator'
import {safeInventory, type SafeInventory} from '~/models/inventory'
import {Role} from '~/models/user'

type InventoryServiceParams = {
  userRepository: UserRepository
  inventoryRepository: InventoryRepository
}

type RegisterInventoryDTO = {
  name: string
}

type UpdateInventoryDTO = {
  name?: string
}

export type RegisterInventoryUseCase = (
  loggedUserEmail: string,
  inventoryData: RegisterInventoryDTO,
) => Promise<SafeInventory>

export type GetAllInventoriesUseCase = (
  loggedUserEmail: string,
) => Promise<SafeInventory[]>

export type UpdateInventoryUseCase = (
  loggedUserEmail: string,
  inventoryCode: string,
  inventoryData: UpdateInventoryDTO,
) => Promise<SafeInventory>

export type DeleteInventoryUseCase = (
  loggedUserEmail: string,
  inventoryCode: string,
) => Promise<SafeInventory>

export const createInventoryService = ({
  userRepository,
  inventoryRepository,
}: InventoryServiceParams) => ({
  registerInventory: async (
    loggedUserEmail: string,
    inventoryData: RegisterInventoryDTO,
  ) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    let inventoryCode = null
    while (inventoryCode === null) {
      const code = UniqueCharOTP(5)
      const inventoryExists = Boolean(
        await inventoryRepository.findByCode(code),
      )
      if (!inventoryExists) {
        inventoryCode = code
      }
    }

    const inventory = await inventoryRepository.create({
      name: inventoryData.name,
      code: inventoryCode,
      businessId: authUser.businessId,
    })

    return safeInventory(inventory)
  },
  getAllInventories: async (loggedUserEmail: string) => {
    const authUser = await userRepository.findByEmail(loggedUserEmail)
    if (!authUser) {
      throw new ServiceError('User not found', 404)
    }

    if (authUser.role !== Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const inventories = await inventoryRepository.findByBusinessId(
      authUser.businessId,
    )
    return inventories.map(i => safeInventory(i))
  },
  updateInventory: async (
    loggedUserEmail: string,
    inventoryCode: string,
    inventoryData: UpdateInventoryDTO,
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

    const changedInventory = await inventoryRepository.update(
      inventory.id,
      inventoryData,
    )

    return safeInventory(changedInventory)
  },
  deleteInventory: async (loggedUserEmail: string, inventoryCode: string) => {
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

    await inventoryRepository.delete(inventory.id)

    return safeInventory(inventory)
  },
})
