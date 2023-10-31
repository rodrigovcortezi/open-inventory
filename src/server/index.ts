import Koa from 'koa'
import bodyParser from '@koa/bodyparser'
import cors from '@koa/cors'
import {createRouter} from '~/server/routes'
import {error as errorMiddleware} from '~/server/middlewares/error'
import type {UserService} from './controllers/user'
import type {BusinessService} from './controllers/business'
import type {SupplierService} from './controllers/supplier'

type ServerParams = {
  config?: {
    port?: number
  }
  userService: UserService
  businessService: BusinessService
  supplierService: SupplierService
}

export const createServer = ({
  config: {port = 3000} = {},
  userService,
  businessService,
  supplierService,
}: ServerParams) => {
  const app = new Koa()

  app.use(bodyParser())
  app.use(cors())

  app.use(errorMiddleware)

  const router = createRouter({userService, businessService, supplierService})
  app.use(router.routes()).use(router.allowedMethods())

  const init = () => {
    app.listen(port)
  }

  return {
    app,
    init,
  }
}
