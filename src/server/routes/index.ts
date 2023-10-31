import Router from 'koa-router'
import {createUserRouter} from './users'
import type {UserService} from '../controllers/user'
import type {BusinessService} from '../controllers/business'
import type {SupplierService} from '../controllers/supplier'
import {createBusinessRouter} from './business'
import {createSupplierRouter} from './supplier'

type RouterParams = {
  userService: UserService
  businessService: BusinessService
  supplierService: SupplierService
}

export const createRouter = ({
  userService,
  businessService,
  supplierService,
}: RouterParams) => {
  const mainRouter = new Router()
  const userRouter = createUserRouter({service: userService})
  const businessRouter = createBusinessRouter({service: businessService})
  const supplierRouter = createSupplierRouter({service: supplierService})

  mainRouter.use(userRouter.routes())
  mainRouter.use(businessRouter.routes())
  mainRouter.use(supplierRouter.routes())

  return mainRouter
}
