import Koa from 'koa'
import bodyParser from '@koa/bodyparser'
import cors from '@koa/cors'
import {createRouter} from '~/server/routes'
import {error as errorMiddleware} from '~/server/middlewares/error'
import type {UserService} from './controllers/user'
import type {SupplierService} from './controllers/supplier'
import type {ProductService} from './controllers/product'
import type {InventoryService} from './controllers/inventory'
import type {InventoryProductService} from './controllers/inventory_product'

type ServerParams = {
  config?: {
    port?: number
  }
  userService: UserService
  supplierService: SupplierService
  productService: ProductService
  inventoryService: InventoryService
  inventoryProductService: InventoryProductService
}

export const createServer = ({
  config: {port = 3000} = {},
  userService,
  supplierService,
  productService,
  inventoryService,
  inventoryProductService,
}: ServerParams) => {
  const app = new Koa()

  app.use(bodyParser())
  app.use(cors())

  app.use(errorMiddleware)

  const router = createRouter({
    userService,
    supplierService,
    productService,
    inventoryService,
    inventoryProductService,
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
