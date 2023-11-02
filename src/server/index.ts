import Koa from 'koa'
import bodyParser from '@koa/bodyparser'
import cors from '@koa/cors'
import {createRouter} from '~/server/routes'
import {error as errorMiddleware} from '~/server/middlewares/error'
import type {UserService} from './controllers/user'
import type {BusinessService} from './controllers/business'
import type {SupplierService} from './controllers/supplier'
import type {ProductService} from './controllers/product'
import type {InventoryService} from './controllers/inventory'

type ServerParams = {
  config?: {
    port?: number
  }
  userService: UserService
  businessService: BusinessService
  supplierService: SupplierService
  productService: ProductService
  inventoryService: InventoryService
}

export const createServer = ({
  config: {port = 3000} = {},
  userService,
  businessService,
  supplierService,
  productService,
  inventoryService,
}: ServerParams) => {
  const app = new Koa()

  app.use(bodyParser())
  app.use(cors())

  app.use(errorMiddleware)

  const router = createRouter({
    userService,
    businessService,
    supplierService,
    productService,
    inventoryService,
  })
  app.use(router.routes()).use(router.allowedMethods())

  const init = () => {
    app.listen(port)
  }

  return {
    app,
    init,
  }
}
