import {CreateUserDto, UpdateUserDto} from '~/models/user'
import {prisma} from '~/prisma'

export const registerUser = async (userData: CreateUserDto) => {
  return await prisma.user.create({data: userData})
}

export const updateUser = async (id: number, userData: UpdateUserDto) => {
  return await prisma.user.update({where: {id}, data: userData})
}
