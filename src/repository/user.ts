import type {CreateUserDto, UpdateUserDto} from '~/dtos/user'
import {User} from '~/models/user'

export interface UserRepository {
  create: (user: CreateUserDto) => Promise<User | undefined>
  update: (id: number, user: UpdateUserDto) => Promise<User | undefined>
  findByEmail: (email: string) => Promise<User | null | undefined>
}
