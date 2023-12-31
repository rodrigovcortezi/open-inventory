import {prisma} from '.'
import type {
  CreateProductDTO,
  UpdateProductDTO,
  ProductRepository,
} from '../product'

export const createProductRepository = (): ProductRepository => ({
  findByEAN: async (ean: string) => {
    return await prisma.product.findUnique({where: {ean}})
  },
  findByBusinessId: async (businessId: number) => {
    return await prisma.product.findMany({
      where: {businessId},
      include: {supplier: true},
    })
  },
  findByBusinessIdAndSKU: async (businessId: number, sku: string) => {
    return await prisma.product.findFirst({
      where: {businessId, sku},
      include: {supplier: true},
    })
  },
  create: async (data: CreateProductDTO) => {
    return await prisma.product.create({data})
  },
  update: async (id: number, data: UpdateProductDTO) => {
    return await prisma.product.update({
      where: {id},
      data,
      include: {supplier: true},
    })
  },
  delete: async (id: number) => {
    return await prisma.product.delete({where: {id}})
  },
})
