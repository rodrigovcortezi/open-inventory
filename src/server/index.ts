import Koa from 'koa'
import bodyParser from '@koa/bodyparser'
import cors from '@koa/cors'
import {createRouter} from '~/server/routes'
import {error as errorMiddleware} from '~/server/middlewares/error'
import type {UserService} from './controllers/user'

type ServerParams = {
  config?: {
    port?: number
  }
  userService: UserService
}

export const createServer = ({
  config: {port = 3000} = {},
  userService,
}: ServerParams) => {
  const app = new Koa()

  app.use(bodyParser())
  app.use(cors())

  app.use(errorMiddleware)

  const router = createRouter({userService})
  app.use(router.routes()).use(router.allowedMethods())

  const init = () => {
    app.listen(port)
  }

  return {
    app,
    init,
  }
}
