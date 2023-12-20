import Router from 'koa-router'
import {validate} from '~/server/middlewares/validate'
import {
  CreateSupplierSchema,
  PartialSupplierSchema,
} from '~/server/schemas/supplier'
import {
  createSupplierController,
  type SupplierService,
} from '../controllers/supplier'
import {authenticate} from '../middlewares/authenticate'

type SupplierRouterParams = {
  service: SupplierService
}

export const createSupplierRouter = ({service}: SupplierRouterParams) => {
  const {registerSupplier, updateSupplier, findAll, deleteSupplier} =
    createSupplierController({
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
  router.put(
    '/:supplierCode',
    validate(PartialSupplierSchema),
    authenticate,
    updateSupplier,
  )
  router.delete('/:supplierCode', authenticate, deleteSupplier)

  return router
}
