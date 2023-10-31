import {prisma} from '.'
import type {CreateSupplierDTO, SupplierRepository} from '../supplier'

export const createSupplierRepository = (): SupplierRepository => ({
  create: async (data: CreateSupplierDTO) => {
    return await prisma.supplier.create({data, include: {business: true}})
  },
})
