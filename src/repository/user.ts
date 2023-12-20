import type {Role, UserWithBusiness} from '~/models/user'

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
  create: (user: CreateUserDTO) => Promise<UserWithBusiness>
  createWithBusiness: (
    user: CreateUserWithBusinessDTO,
  ) => Promise<UserWithBusiness>
  update: (id: number, data: UpdateUserDTO) => Promise<UserWithBusiness>
  findByEmail: (email: string) => Promise<UserWithBusiness | null>
  findByID: (id: number) => Promise<UserWithBusiness | null>
}
