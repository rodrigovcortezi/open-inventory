import Koa from 'koa'
import bodyParser from '@koa/bodyparser'
import cors from '@koa/cors'
import router from '~/routes'

const app = new Koa()

app.use(bodyParser())
app.use(cors())

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
