import {prisma} from '.'
import type {
  CreateInventoryProductDTO,
  InventoryProductRepository,
  UpdateInventoryProductDTO,
} from '../inventory_product'

export const createInventoryProductRepository =
  (): InventoryProductRepository => ({
    create: async (data: CreateInventoryProductDTO) => {
      return await prisma.inventoryProduct.create({
        data,
        include: {product: true},
      })
    },
    findByInventoryIdAndProductId: async (
      inventoryId: number,
      productId: number,
    ) => {
      return await prisma.inventoryProduct.findFirst({
        where: {inventoryId, productId},
      })
    },
    findByInventoryId: async (inventoryId: number) => {
      return await prisma.inventoryProduct.findMany({
        where: {inventoryId},
        include: {product: true},
      })
    },
    update: async (id: number, data: UpdateInventoryProductDTO) => {
      return await prisma.inventoryProduct.update({
        where: {id},
        data,
        include: {product: true},
      })
    },
  })
