import Router from 'koa-router'
import {createUserController, type UserService} from '~/server/controllers/user'
import {validate} from '~/server/middlewares/validate'
import {
  AddAdminUserSchema,
  AddStoreUserSchema,
  AddSupplierUserSchema,
  CreateUserSchema,
  LoginUserSchema,
  PartialUserSchema,
} from '~/server/schemas/user'
import {authenticate} from '../middlewares/authenticate'
import {PartialBusinessSchema} from '../schemas/business'

type UserRouterParams = {
  service: UserService
}

export const createUserRouter = ({service}: UserRouterParams) => {
  const {
    createUser,
    addAdminUser,
    addStoreUser,
    addSupplierUser,
    updateUser,
    updateUserBusiness,
    loginUser,
  } = createUserController({
    service,
  })

  const router = new Router()
  router.post('/users', validate(CreateUserSchema), createUser)
  router.post(
    '/admin-users',
    validate(AddAdminUserSchema),
    authenticate,
    addAdminUser,
  )
  router.post(
    '/store-users',
    validate(AddStoreUserSchema),
    authenticate,
    addStoreUser,
  )
  router.post(
    '/supplier-users',
    validate(AddSupplierUserSchema),
    authenticate,
    addSupplierUser,
  )
  router.put('/users/me', validate(PartialUserSchema), authenticate, updateUser)
  router.post('/users/login', validate(LoginUserSchema), loginUser)
  router.put(
    '/users/me/business',
    validate(PartialBusinessSchema),
    authenticate,
    updateUserBusiness,
  )

  return router
}
