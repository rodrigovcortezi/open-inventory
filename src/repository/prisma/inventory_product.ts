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
    findByProductId: async (productId: number) => {
      return await prisma.inventoryProduct.findFirst({where: {productId}})
    },
    update: async (id: number, data: UpdateInventoryProductDTO) => {
      return await prisma.inventoryProduct.update({
        where: {id},
        data,
        include: {product: true},
      })
    },
  })
