import {User} from '~/models/user'

export type CreateUserDTO = {
  name: string
  email: string
  password: string
  business: {
    name: string
    cnpj: string
  }
}

export type UpdateUserDTO = {
  name?: string
  email?: string
}

export interface UserRepository {
  create: (user: CreateUserDTO) => Promise<User>
  update: (id: number, user: UpdateUserDTO) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
  findByID: (id: number) => Promise<User | null>
}
