import type {Context} from 'koa'
import type {
  AddAdminUserUseCase,
  AddStoreUserUseCase,
  AddSupplierUserUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  UpdateUserUseCase,
} from '~/usecases/users'
import {ControllerError} from './error'
import {buildResponse} from '../response'
import {UserContext} from '../middlewares/authenticate'

export type UserService = {
  registerUser: RegisterUserUseCase
  addAdminUser: AddAdminUserUseCase
  addStoreUser: AddStoreUserUseCase
  addSupplierUser: AddSupplierUserUseCase
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
    ctx.status = 201
  }

  const addAdminUser = async (ctx: UserContext) => {
    const user = await service.addAdminUser(
      ctx.request.body,
      ctx.user?.email as string,
    )
    ctx.body = buildResponse({data: user})
    ctx.status = 201
  }

  const addStoreUser = async (ctx: UserContext) => {
    const user = await service.addStoreUser(
      ctx.request.body,
      ctx.user?.email as string,
    )
    ctx.body = buildResponse({data: user})
    ctx.status = 201
  }

  const addSupplierUser = async (ctx: UserContext) => {
    const user = await service.addSupplierUser(
      ctx.request.body,
      ctx.user?.email as string,
    )
    ctx.body = buildResponse({data: user})
    ctx.status = 201
  }

  const loginUser = async (ctx: Context) => {
    const user = await service.loginUser(ctx.request.body)
    ctx.body = buildResponse({data: user})
  }

  const updateUser = async (ctx: UserContext) => {
    const userId = parseInt(ctx.params.id)
    if (isNaN(userId)) {
      throw new ControllerError('Invalid param')
    }

    const user = await service.updateUser(
      userId,
      ctx.request.body,
      ctx.user?.email as string,
    )
    ctx.body = buildResponse({data: user})
  }

  return {
    createUser,
    addAdminUser,
    addStoreUser,
    addSupplierUser,
    loginUser,
    updateUser,
  }
}
