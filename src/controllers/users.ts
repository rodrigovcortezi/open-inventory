import type {Context} from 'koa'
import {createPrismaRepository} from '~/repository/prisma'
import {userService} from '~/services/users'

const prismaRepository = createPrismaRepository()
const service = userService(prismaRepository.userRepository)

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
    ctx.throw(400, 'Invalid id param')
  }

  const user = await service.updateUser(userId, ctx.request.body)
  ctx.body = user
}

export {createUser, loginUser, updateUser}
