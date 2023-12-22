import Router from 'koa-router'
import {authenticate} from '~/server/middlewares/authenticate'
import {validate} from '~/server/middlewares/validate'
import {type SaleService, createSaleController} from '../controllers/sale'
import {CheckAvailabilitySchema, CreateSaleSchema} from '../schemas/sale'

type ProductRouterParams = {
  service: SaleService
}

export const createSaleRouter = ({service}: ProductRouterParams) => {
  const {registerSale, findAll, checkAvailability, returnSale, getSale} =
    createSaleController({
      service,
    })

  const router = new Router({prefix: '/sales'})
  router.post('/', validate(CreateSaleSchema), authenticate, registerSale)
  router.get('/', authenticate, findAll)
  router.post(
    '/check-availability',
    validate(CheckAvailabilitySchema),
    authenticate,
    checkAvailability,
  )
  router.post('/:id/return', authenticate, returnSale)
  router.get('/:id', authenticate, getSale)

  return router
}
