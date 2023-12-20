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
  const {registerSupplier, findAll, deleteSupplier} = createSupplierController({
    service,
  })
  const router = new Router({prefix: '/suppliers'})
  router.post(
    '/',
    validate(CreateSupplierSchema),
    authenticate,
    registerSupplier,
  )
  router.get('/', authenticate, findAll)
  router.delete('/:id', authenticate, deleteSupplier)

  return router
}
