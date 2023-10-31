import Router from 'koa-router'
import {validate} from '~/server/middlewares/validate'
import {CreateSupplierSchema} from '~/server/schemas/supplier'
import {
  createSupplierController,
  type SupplierService,
} from '../controllers/supplier'
import {authenticate} from '../middlewares/authenticate'

type SupplierRouterParams = {
  service: SupplierService
}

export const createSupplierRouter = ({service}: SupplierRouterParams) => {
  const {registerSupplier} = createSupplierController({service})
  const router = new Router({prefix: '/suppliers'})
  router.post(
    '/',
    validate(CreateSupplierSchema),
    authenticate,
    registerSupplier,
  )

  return router
}
