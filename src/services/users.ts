import type {CreateUserDto, LoginUserDto, UpdateUserDto} from '~/dtos/user'
import bcrypt from 'bcrypt'
import {ServiceError} from './error'
import jwt from 'jsonwebtoken'
import type {UserRepository} from '~/repository/user'
import {RepositoryError} from '~/repository/error'

type SafeUser = {
  name: string
  email: string
}

const handleError = async <T>(fn: () => T) => {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof RepositoryError) {
      throw new ServiceError(err.message, 400, err.details)
    }
    throw err
  }
}

const generateAccessToken = (user: SafeUser) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '60 days',
  })
}

export const userService = (repository: UserRepository) => ({
  registerUser: async (userData: CreateUserDto) => {
    const passwordHash = await bcrypt.hash(userData.password, 10)
    const user = await handleError(() =>
      repository.create({...userData, password: passwordHash}),
    )
    return user
  },

  loginUser: async (userData: LoginUserDto) => {
    const {email} = userData
    const user = await handleError(() => repository.findByEmail(email))
    if (!user) {
      throw new ServiceError('User not found', 404)
    }

    if (await bcrypt.compare(userData.password, user.password)) {
      const {name, email} = user
      const safeUser: SafeUser = {name, email}
      const token = generateAccessToken(safeUser)
      return {...safeUser, token}
    }
  },

  updateUser: async (id: number, userData: UpdateUserDto) => {
    const user = await handleError(() => repository.update(id, userData))
    return user
  },
})
