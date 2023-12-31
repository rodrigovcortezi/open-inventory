import {prisma} from '.'
import type {
  CreateInventoryDTO,
  InventoryRepository,
  UpdateInventoryDTO,
} from '../inventory'

export const createInventoryRepository = (): InventoryRepository => ({
  findByCode: async (code: string) => {
    return await prisma.inventory.findUnique({
      where: {code},
    })
  },
  findByBusinessId: async (businessId: number) => {
    return await prisma.inventory.findMany({where: {businessId}})
  },
  create: async (data: CreateInventoryDTO) => {
    return await prisma.inventory.create({data})
  },
  update: async (id: number, data: UpdateInventoryDTO) => {
    return await prisma.inventory.update({where: {id}, data})
  },
  delete: async (id: number) => {
    return await prisma.inventory.delete({where: {id}})
  },
})
