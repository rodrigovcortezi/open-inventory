import type {Context} from 'koa'
import * as userService from '~/services/user'

const createUser = async (ctx: Context) => {
  const user = await userService.registerUser(ctx.request.body)
  ctx.body = user
}

const updateUser = async (ctx: Context) => {
  const userId = parseInt(ctx.params.id)
  if (isNaN(userId)) {
    ctx.status = 400
    ctx.body = 'Invalid user id'
    return
  }

  const user = await userService.updateUser(userId, ctx.request.body)
  ctx.body = user
}

export {createUser, updateUser}
