import Koa from 'koa'
import bodyParser from '@koa/bodyparser'
import cors from '@koa/cors'
import router from '~/routes'
import {error as errorMiddleware} from '~/middlewares/error'

const app = new Koa()

app.use(bodyParser())
app.use(cors())

app.use(errorMiddleware)

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
