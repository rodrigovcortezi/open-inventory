import bcrypt from 'bcrypt'
import {ServiceError} from './error'
import jwt from 'jsonwebtoken'
import type {UserRepository} from '~/repository/user'
import type {User} from '~/models/user'
import type {BusinessRepository} from '~/repository/business'

type SafeUser = Omit<User, 'password' | 'business' | 'createdAt' | 'updateAt'>

type UserWithToken = SafeUser & {token: string}

type RegisterUserDTO = {
  name: string
  email: string
  password: string
  business: {
    name: string
    cnpj: string
  }
}

type LoginUserDTO = {
  email: string
  password: string
}

type UpdateUserDTO = {
  name?: string
  email?: string
}

export type RegisterUserUseCase = (
  userData: RegisterUserDTO,
) => Promise<SafeUser>

export type LoginUserUseCase = (
  userData: LoginUserDTO,
) => Promise<UserWithToken>

export type UpdateUserUseCase = (
  id: number,
  userData: UpdateUserDTO,
) => Promise<SafeUser>

type UserServiceParams = {
  userRepository: UserRepository
  businessRepository: BusinessRepository
}

const filterSensitiveData = (user: User) => {
  const {name, email} = user
  return {name, email}
}

const generateAccessToken = (user: User) => {
  const safeUser = filterSensitiveData(user)
  return jwt.sign(safeUser, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '60 days',
  })
}

export const createUserService = ({
  userRepository,
  businessRepository,
}: UserServiceParams) => ({
  registerUser: async (userData: RegisterUserDTO) => {
    const userExists = Boolean(await userRepository.findByEmail(userData.email))
    if (userExists) {
      throw new ServiceError('Email is already in use', 400)
    }

    const businessExists = Boolean(
      await businessRepository.findByCNPJ(userData.business.cnpj),
    )
    if (businessExists) {
      throw new ServiceError('Business already exists', 400)
    }

    const passwordHash = await bcrypt.hash(userData.password, 10)
    const user = await userRepository.create({
      ...userData,
      password: passwordHash,
    })
    return filterSensitiveData(user)
  },

  loginUser: async (userData: LoginUserDTO) => {
    const {email} = userData
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw new ServiceError('User not found', 404)
    }

    if (await bcrypt.compare(userData.password, user.password)) {
      const token = generateAccessToken(user)
      return {...filterSensitiveData(user), token}
    } else {
      throw new ServiceError('Wrong password', 401)
    }
  },

  updateUser: async (id: number, userData: UpdateUserDTO) => {
    const userExists = Boolean(await userRepository.findByID(id))
    if (!userExists) {
      throw new ServiceError('User not found', 404)
    }

    const user = await userRepository.update(id, userData)
    return filterSensitiveData(user)
  },
})
