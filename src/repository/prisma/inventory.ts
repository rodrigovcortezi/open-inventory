import {prisma} from '.'
import type {
  CreateInventoryDTO,
  InventoryRepository,
  UpdateInventoryDTO,
} from '../inventory'

export const createInventoryRepository = (): InventoryRepository => ({
  findById: async (id: number) => {
    return await prisma.inventory.findUnique({
      where: {id},
      include: {business: true},
    })
  },
  findByCode: async (code: string) => {
    return await prisma.inventory.findUnique({
      where: {code},
      include: {business: true},
    })
  },
  create: async (data: CreateInventoryDTO) => {
    return await prisma.inventory.create({data, include: {business: true}})
  },
  update: async (id: number, data: UpdateInventoryDTO) => {
    return await prisma.inventory.update({
      where: {id},
      data,
      include: {business: true},
    })
  },
  delete: async (id: number) => {
    return await prisma.inventory.delete({
      where: {id},
      include: {business: true},
    })
  },
})
