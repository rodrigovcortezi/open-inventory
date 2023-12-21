import type {UserRepository} from '~/repository/user'
import type {InventoryRepository} from '~/repository/inventory'
import {ServiceError} from './error'
import {UniqueCharOTP} from 'unique-string-generator'
import {
  safeInventory,
  type Inventory,
  type SafeInventory,
} from '~/models/inventory'
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

export type UpdateInventoryUseCase = (
  loggedUserEmail: string,
  id: number,
  inventoryData: UpdateInventoryDTO,
) => Promise<Inventory>

export type DeleteInventoryUseCase = (
  loggedUserEmail: string,
  id: number,
) => Promise<Inventory>

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
  updateInventory: async (
    loggedUserEmail: string,
    id: number,
    inventoryData: UpdateInventoryDTO,
  ) => {
    const user = await userRepository.findByEmail(loggedUserEmail)
    if (!user) {
      throw new ServiceError('User not found', 404)
    }

    const inventory = await inventoryRepository.findById(id)
    if (!inventory) {
      throw new ServiceError('Inventory not found', 404)
    }

    if (user.business.id !== inventory.businessId) {
      throw new ServiceError('Inventory does not belong to user business', 403)
    }

    const changedInventory = await inventoryRepository.update(id, inventoryData)

    return changedInventory
  },
  deleteInventory: async (loggedUserEmail: string, id: number) => {
    const user = await userRepository.findByEmail(loggedUserEmail)
    if (!user) {
      throw new ServiceError('User not found', 404)
    }

    const inventory = await inventoryRepository.findById(id)
    if (!inventory) {
      throw new ServiceError('Inventory not found', 404)
    }

    if (user.business.id !== inventory.businessId) {
      throw new ServiceError('Inventory does not belong to user business', 403)
    }

    await inventoryRepository.delete(id)

    return inventory
  },
})
