import Router from 'koa-router'
import {createUserController, type UserService} from '~/server/controllers/user'
import {validate} from '~/server/middlewares/validate'
import {
  CreateUserSchema,
  LoginUserSchema,
  PartialUserSchema,
} from '~/server/schemas/user'

type UserRouterParams = {
  service: UserService
}

export const createUserRouter = ({service}: UserRouterParams) => {
  const {createUser, updateUser, loginUser} = createUserController({service})

  const router = new Router({prefix: '/users'})
  router.post('/new', validate(CreateUserSchema), createUser)
  router.put('/:id', validate(PartialUserSchema), updateUser)
  router.post('/login', validate(LoginUserSchema), loginUser)

  return router
}
