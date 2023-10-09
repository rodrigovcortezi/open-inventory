import {prisma} from '.'
import {BusinessRepository, UpdateBusinessDTO} from '../business'

export const createBusinessRepository = (): BusinessRepository => ({
  findByCNPJ: async (cnpj: string) => {
    return await prisma.business.findUnique({where: {cnpj}})
  },
  update: async (id: number, data: UpdateBusinessDTO) => {
    return await prisma.business.update({where: {id}, data})
  },
})
