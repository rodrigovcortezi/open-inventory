import type {Role, User} from '~/models/user'

export type CreateUserDTO = {
  name: string
  email: string
  password: string
  role: Role.ADMIN
  business: {
    name: string
    cnpj: string
  }
}

export type UpdateUserDTO = {
  name?: string
  email?: string
}

export type CreateUserWithBusinessDTO = {
  name: string
  email: string
  password: string
  role: Role
  businessId: number
  supplierId?: number
}

export interface UserRepository {
  create: (user: CreateUserDTO) => Promise<User>
  createWithBusiness: (user: CreateUserWithBusinessDTO) => Promise<User>
  update: (id: number, data: UpdateUserDTO) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
  findByID: (id: number) => Promise<User | null>
}
