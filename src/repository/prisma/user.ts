import type {CreateUserDTO, UpdateUserDTO, UserRepository} from '../user'
import {prisma} from '.'

export const createUserRepository = (): UserRepository => ({
  create: async (userData: CreateUserDTO) => {
    return await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        business: {
          create: {...userData.business},
        },
      },
      include: {
        business: true,
      },
    })
  },

  findByID: async (id: number) => {
    return await prisma.user.findUnique({
      where: {id},
      include: {business: true},
    })
  },

  findByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: {email},
      include: {business: true},
    })
  },

  update: async (id: number, data: UpdateUserDTO) => {
    return await prisma.user.update({
      where: {id},
      data,
      include: {business: true},
    })
  },
})
