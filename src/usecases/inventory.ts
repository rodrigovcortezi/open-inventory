import type {UserRepository} from '~/repository/user'
import type {InventoryRepository} from '~/repository/inventory'
import {ServiceError} from './error'
import {UniqueCharOTP} from 'unique-string-generator'
import type {Inventory} from '~/models/inventory'

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
) => Promise<Inventory>

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
    const user = await userRepository.findByEmail(loggedUserEmail)
    if (!user) {
      throw new ServiceError('User not found', 404)
    }

    const inventory = await inventoryRepository.create({
      ...inventoryData,
      code: UniqueCharOTP(5),
      businessId: user.business.id as number,
    })

    return inventory
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

    if (user.business.id !== inventory.business.id) {
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

    if (user.business.id !== inventory.business.id) {
      throw new ServiceError('Inventory does not belong to user business', 403)
    }

    await inventoryRepository.delete(id)

    return inventory
  },
})
