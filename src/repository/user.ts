import type {CreateUserDto, UpdateUserDto} from '~/dtos/user'
import {User} from '~/models/user'

export interface UserRepository {
  create: (user: CreateUserDto) => Promise<User>
  update: (id: number, user: UpdateUserDto) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
}
