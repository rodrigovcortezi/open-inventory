import type {
  CreateUserDTO,
  CreateUserWithBusinessDTO,
  UpdateUserDTO,
  UserRepository,
} from '../user'
import {prisma} from '.'
import {Role} from '~/models/user'

export const createUserRepository = (): UserRepository => ({
  create: async (userData: CreateUserDTO) => {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: Role.ADMIN,
        business: {
          create: {...userData.business},
        },
      },
      include: {
        business: true,
      },
    })
    return {...user, role: user.role as Role}
  },

  createWithBusiness: async (userData: CreateUserWithBusinessDTO) => {
    const user = await prisma.user.create({
      data: userData,
      include: {business: true},
    })
    return {...user, role: user.role as Role}
  },

  findByID: async (id: number) => {
    const user = await prisma.user.findUnique({
      where: {id},
      include: {business: true},
    })
    if (user) {
      return {...user, role: user.role as Role}
    } else {
      return null
    }
  },

  findByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: {email},
      include: {business: true},
    })
    if (user) {
      return {...user, role: user.role as Role}
    } else {
      return null
    }
  },

  update: async (id: number, data: UpdateUserDTO) => {
    const user = await prisma.user.update({
      where: {id},
      data,
      include: {business: true},
    })
    return {...user, role: user.role as Role}
  },
})
