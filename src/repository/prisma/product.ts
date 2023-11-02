import {prisma} from '.'
import type {CreateProductDTO, ProductRepository} from '../product'

export const createProductRepository = (): ProductRepository => ({
  findById: async (id: number) => {
    return await prisma.product.findUnique({
      where: {id},
      include: {business: true},
    })
  },
  create: async (data: CreateProductDTO) => {
    return await prisma.product.create({data, include: {business: true}})
  },
  delete: async (id: number) => {
    return await prisma.product.delete({where: {id}, include: {business: true}})
  },
})
