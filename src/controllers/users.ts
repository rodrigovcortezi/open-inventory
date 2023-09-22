import type {Context} from 'koa'
import {userService} from '~/services/users'
import {ControllerError} from './error'
import {createUserRepository} from '~/repository/prisma/user'
import {createBusinessRepository} from '~/repository/prisma/business'

const userRepository = createUserRepository()
const businessRepository = createBusinessRepository()
const service = userService({userRepository, businessRepository})

const createUser = async (ctx: Context) => {
  const user = await service.registerUser(ctx.request.body)
  ctx.body = user
}

const loginUser = async (ctx: Context) => {
  const user = await service.loginUser(ctx.request.body)
  ctx.body = user
}

const updateUser = async (ctx: Context) => {
  const userId = parseInt(ctx.params.id)
  if (isNaN(userId)) {
    throw new ControllerError('Invalid param')
  }

  const user = await service.updateUser(userId, ctx.request.body)
  ctx.body = user
}

export {createUser, loginUser, updateUser}
