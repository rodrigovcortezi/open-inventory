import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library'
import type {CreateUserDto, UpdateUserDto} from '~/dtos/user'
import {prisma} from '~/prisma'
import {RepositoryError} from '../error'

const handleError = async <T>(fn: () => T) => {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      throw new RepositoryError(err.meta)
    } else if (err instanceof PrismaClientUnknownRequestError) {
      throw new RepositoryError({message: err.message})
    }
    throw err
  }
}

export const createUserRepository = () => ({
  create: async (data: CreateUserDto) => {
    return await handleError(() => prisma.user.create({data}))
  },

  findByEmail: async (email: string) => {
    return await handleError(() => prisma.user.findUnique({where: {email}}))
  },

  update: async (id: number, data: UpdateUserDto) => {
    return await handleError(() => prisma.user.update({where: {id}, data}))
  },
})
