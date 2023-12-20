import {prisma} from '.'
import type {CreateSupplierDTO, SupplierRepository} from '../supplier'

export const createSupplierRepository = (): SupplierRepository => ({
  findByBusinessId: async (businessId: number) => {
    return await prisma.supplier.findMany({where: {businessId}})
  },

  findById: async (id: number) => {
    return await prisma.supplier.findUnique({
      where: {id},
      include: {business: true},
    })
  },

  findByCode: async (code: string) => {
    return await prisma.supplier.findUnique({
      where: {code},
      include: {business: true},
    })
  },

  findByCNPJ: async (cnpj: string) => {
    return await prisma.supplier.findUnique({
      where: {cnpj},
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
