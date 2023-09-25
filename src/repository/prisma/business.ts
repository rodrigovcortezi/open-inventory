import {prisma} from '.'
import {BusinessRepository} from '../business'

export const createBusinessRepository = (): BusinessRepository => ({
  findByCNPJ: async (cnpj: string) => {
    return await prisma.business.findUnique({where: {cnpj}})
  },
})
