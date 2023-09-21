import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library'
import type {CreateUserDto, UpdateUserDto} from '~/dtos/user'
import {User} from '~/models/user'
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
  create: async (data: CreateUserDto): Promise<User | undefined> => {
    return await handleError(() => prisma.user.create({data}))
  },

  findByEmail: async (email: string): Promise<User | null | undefined> => {
    return await handleError(() => prisma.user.findUnique({where: {email}}))
  },

  update: async (
    id: number,
    data: UpdateUserDto,
  ): Promise<User | undefined> => {
    return await handleError(() => prisma.user.update({where: {id}, data}))
  },
})
