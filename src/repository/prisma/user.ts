import type {CreateUserDto, UpdateUserDto} from '~/dtos/user'
import {prisma} from '~/prisma'
import type {UserRepository} from '../user'

export const createUserRepository = (): UserRepository => ({
  create: async (userData: CreateUserDto) => {
    const data = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      business: {
        create: {...userData.business},
      },
    }
    return await prisma.user.create({
      data,
      include: {
        business: true,
      },
    })
  },

  findByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: {email},
      include: {business: true},
    })
  },

  update: async (id: number, data: UpdateUserDto) => {
    return await prisma.user.update({
      where: {id},
      data,
      include: {business: true},
    })
  },
})
