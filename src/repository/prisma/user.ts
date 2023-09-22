import type {CreateUserDto, UpdateUserDto} from '~/dtos/user'
import {prisma} from '~/prisma'

export const createUserRepository = () => ({
  create: async (data: CreateUserDto) => {
    return await prisma.user.create({data})
  },

  findByEmail: async (email: string) => {
    return await prisma.user.findUnique({where: {email}})
  },

  update: async (id: number, data: UpdateUserDto) => {
    return await prisma.user.update({where: {id}, data})
  },
})
