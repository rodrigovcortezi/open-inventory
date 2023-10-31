import {prisma} from '.'
import type {CreateSupplierDTO, SupplierRepository} from '../supplier'

export const createSupplierRepository = (): SupplierRepository => ({
  findById: async (id: number) => {
    return await prisma.supplier.findUnique({
      where: {id},
      include: {business: true},
    })
  },
  create: async (data: CreateSupplierDTO) => {
    return await prisma.supplier.create({data, include: {business: true}})
  },
  delete: async (id: number) => {
    return await prisma.supplier.delete({
      where: {id},
      include: {business: true},
    })
  },
})
