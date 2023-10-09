import Router from 'koa-router'
import {createUserRouter} from './users'
import type {UserService} from '../controllers/user'
import type {BusinessService} from '../controllers/business'
import {createBusinessRouter} from './business'

type RouterParams = {
  userService: UserService
  businessService: BusinessService
}

export const createRouter = ({userService, businessService}: RouterParams) => {
  const mainRouter = new Router()
  const userRouter = createUserRouter({service: userService})
  const businessRouter = createBusinessRouter({service: businessService})

  mainRouter.use(userRouter.routes())
  mainRouter.use(businessRouter.routes())

  return mainRouter
}
