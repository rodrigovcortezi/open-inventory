import Router from 'koa-router'
import {createUserRouter} from './users'
import type {UserService} from '~/server/controllers/user'
import type {BusinessService} from '~/server/controllers/business'
import type {SupplierService} from '~/server/controllers/supplier'
import {createBusinessRouter} from './business'
import {createSupplierRouter} from './supplier'
import {createProductRouter} from './product'
import type {ProductService} from '~/server/controllers/product'
import {createInventoryRouter} from './inventory'
import type {InventoryService} from '~/server/controllers/inventory'

type RouterParams = {
  userService: UserService
  businessService: BusinessService
  supplierService: SupplierService
  productService: ProductService
  inventoryService: InventoryService
}

export const createRouter = ({
  userService,
  businessService,
  supplierService,
  productService,
  inventoryService,
}: RouterParams) => {
  const mainRouter = new Router()
  const userRouter = createUserRouter({service: userService})
  const businessRouter = createBusinessRouter({service: businessService})
  const supplierRouter = createSupplierRouter({service: supplierService})
  const productRouter = createProductRouter({service: productService})
  const inventoryRouter = createInventoryRouter({service: inventoryService})

  mainRouter.use(userRouter.routes())
  mainRouter.use(businessRouter.routes())
  mainRouter.use(supplierRouter.routes())
  mainRouter.use(productRouter.routes())
  mainRouter.use(inventoryRouter.routes())

  return mainRouter
}
