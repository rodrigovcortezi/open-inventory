import {prisma} from '.'
import type {CreateProductDTO, ProductRepository} from '../product'

export const createProductRepository = (): ProductRepository => ({
  create: async (data: CreateProductDTO) => {
    return await prisma.product.create({data, include: {business: true}})
  },
})
