import Router from 'koa-router'
import userRouter from './users'

const mainRouter = new Router()

mainRouter.use(userRouter.routes())

export default mainRouter
