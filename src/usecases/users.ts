import bcrypt from 'bcrypt'
import {ServiceError} from './error'
import jwt from 'jsonwebtoken'
import type {UserRepository} from '~/repository/user'
import {Role, safeUser, type User} from '~/models/user'
import type {BusinessRepository} from '~/repository/business'
import type {SafeUser} from '~/models/user'
import type {SupplierRepository} from '~/repository/supplier'

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

type AddAdminUserDTO = {
  name: string
  email: string
  password: string
}

type AddStoreUserDTO = {
  name: string
  email: string
  password: string
}

type AddSupplierUserDTO = {
  name: string
  email: string
  password: string
  supplierCode: string
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

export type AddAdminUserUseCase = (
  userData: AddAdminUserDTO,
  loggedUserEmail: string,
) => Promise<SafeUser>

export type AddStoreUserUseCase = (
  userData: AddStoreUserDTO,
  loggedUserEmail: string,
) => Promise<SafeUser>

export type AddSupplierUserUseCase = (
  userData: AddSupplierUserDTO,
  loggedUserEmail: string,
) => Promise<SafeUser>

export type LoginUserUseCase = (
  userData: LoginUserDTO,
) => Promise<UserWithToken>

export type UpdateUserUseCase = (
  id: number,
  userData: UpdateUserDTO,
  loggedUserEmail: string,
) => Promise<SafeUser>

type UserServiceParams = {
  userRepository: UserRepository
  businessRepository: BusinessRepository
  supplierRepository: SupplierRepository
}

const generateAccessToken = (user: User) => {
  const data = safeUser(user)
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '60 days',
  })
}

export const createUserService = ({
  userRepository,
  businessRepository,
  supplierRepository,
}: UserServiceParams) => ({
  registerUser: async (userData: RegisterUserDTO) => {
    const userExists = Boolean(await userRepository.findByEmail(userData.email))
    if (userExists) {
      throw new ServiceError('Email is already in use', 422)
    }

    const businessExists = Boolean(
      await businessRepository.findByCNPJ(userData.business.cnpj),
    )
    if (businessExists) {
      throw new ServiceError('CNPJ is already in use', 422)
    }

    const passwordHash = await bcrypt.hash(userData.password, 10)
    const user = await userRepository.create({
      ...userData,
      role: Role.ADMIN,
      password: passwordHash,
    })
    return safeUser(user)
  },

  addAdminUser: async (userData: AddAdminUserDTO, loggedUserEmail: string) => {
    const authUser = (await userRepository.findByEmail(loggedUserEmail)) as User
    if (authUser.role != Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const userExists = Boolean(await userRepository.findByEmail(userData.email))
    if (userExists) {
      throw new ServiceError('Email is already in use', 422)
    }

    const passwordHash = await bcrypt.hash(userData.password, 10)
    const user = await userRepository.createWithBusiness({
      ...userData,
      password: passwordHash,
      role: Role.ADMIN,
      businessId: authUser.business.id,
    })

    return safeUser(user)
  },

  addStoreUser: async (userData: AddStoreUserDTO, loggedUserEmail: string) => {
    const authUser = (await userRepository.findByEmail(loggedUserEmail)) as User
    if (authUser.role != Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const userExists = Boolean(await userRepository.findByEmail(userData.email))
    if (userExists) {
      throw new ServiceError('Email is already in use', 422)
    }

    const passwordHash = await bcrypt.hash(userData.password, 10)
    const user = await userRepository.createWithBusiness({
      ...userData,
      password: passwordHash,
      role: Role.STORE,
      businessId: authUser.business.id,
    })

    return safeUser(user)
  },

  addSupplierUser: async (
    userData: AddSupplierUserDTO,
    loggedUserEmail: string,
  ) => {
    const authUser = (await userRepository.findByEmail(loggedUserEmail)) as User
    if (authUser.role != Role.ADMIN) {
      throw new ServiceError('User not allowed', 403)
    }

    const userExists = Boolean(await userRepository.findByEmail(userData.email))
    if (userExists) {
      throw new ServiceError('Email is already in use', 422)
    }

    const supplier = await supplierRepository.findByCode(userData.supplierCode)
    if (!supplier || supplier.business.id != authUser.business.id) {
      throw new ServiceError('Supplier not found', 404)
    }

    const passwordHash = await bcrypt.hash(userData.password, 10)
    const user = await userRepository.createWithBusiness({
      name: userData.name,
      email: userData.email,
      password: passwordHash,
      role: Role.SUPPLIER,
      businessId: authUser.business.id,
      supplierId: supplier.id,
    })

    return safeUser(user)
  },

  loginUser: async (userData: LoginUserDTO) => {
    const {email} = userData
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw new ServiceError('User not found', 404)
    }

    if (await bcrypt.compare(userData.password, user.password)) {
      const token = generateAccessToken(user)
      return {...safeUser(user), token}
    } else {
      throw new ServiceError('Wrong password', 401)
    }
  },

  updateUser: async (
    id: number,
    userData: UpdateUserDTO,
    loggedUserEmail: string,
  ) => {
    const userExists = await userRepository.findByID(id)
    if (!userExists) {
      throw new ServiceError('User not found', 404)
    }

    if (loggedUserEmail !== userExists.email) {
      throw new ServiceError('Logged user cannot update other user', 403)
    }

    const user = await userRepository.update(id, userData)
    return safeUser(user)
  },
})
