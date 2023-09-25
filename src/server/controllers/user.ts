import type {Context} from 'koa'
import type {
  LoginUserUseCase,
  RegisterUserUseCase,
  UpdateUserUseCase,
} from '~/usecases/users'
import {ControllerError} from './error'
import {buildResponse} from '../response'

export type UserService = {
  registerUser: RegisterUserUseCase
  loginUser: LoginUserUseCase
  updateUser: UpdateUserUseCase
}

type UserControllerParams = {
  service: UserService
}

export const createUserController = ({service}: UserControllerParams) => {
  const createUser = async (ctx: Context) => {
    const user = await service.registerUser(ctx.request.body)
    ctx.body = buildResponse({data: user})
  }

  const loginUser = async (ctx: Context) => {
    const user = await service.loginUser(ctx.request.body)
    ctx.body = buildResponse({data: user})
  }

  const updateUser = async (ctx: Context) => {
    const userId = parseInt(ctx.params.id)
    if (isNaN(userId)) {
      throw new ControllerError('Invalid param')
    }

    const user = await service.updateUser(userId, ctx.request.body)
    ctx.body = buildResponse({data: user})
  }

  return {createUser, loginUser, updateUser}
}
