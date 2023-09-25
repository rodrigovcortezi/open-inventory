import Router from 'koa-router'
import {createUserRouter} from './users'
import type {
  LoginUserUseCase,
  RegisterUserUseCase,
  UpdateUserUseCase,
} from '~/usecases/users'

type RouterParams = {
  userService: {
    registerUser: RegisterUserUseCase
    loginUser: LoginUserUseCase
    updateUser: UpdateUserUseCase
  }
}

export const createRouter = ({userService}: RouterParams) => {
  const mainRouter = new Router()
  const userRouter = createUserRouter({service: userService})
  return mainRouter.use(userRouter.routes())
}
