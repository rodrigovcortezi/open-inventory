import Router from 'koa-router'
import {createUserController, type UserService} from '~/server/controllers/user'
import {validate} from '~/server/middlewares/validate'
import {
  AddUserSchema,
  CreateUserSchema,
  LoginUserSchema,
  PartialUserSchema,
} from '~/server/schemas/user'
import {authenticate} from '../middlewares/authenticate'

type UserRouterParams = {
  service: UserService
}

export const createUserRouter = ({service}: UserRouterParams) => {
  const {createUser, addUser, updateUser, loginUser} = createUserController({
    service,
  })

  const router = new Router()
  router.post('/users', validate(CreateUserSchema), createUser)
  router.post('/admin-users', validate(AddUserSchema), authenticate, addUser)
  router.put(
    '/users/:id',
    validate(PartialUserSchema),
    authenticate,
    updateUser,
  )
  router.post('/users/login', validate(LoginUserSchema), loginUser)

  return router
}
