import Router from 'koa-router'
import {authenticate} from '~/server/middlewares/authenticate'
import {validate} from '~/server/middlewares/validate'
import {type SaleService, createSaleController} from '../controllers/sale'
import {CreateSaleSchema} from '../schemas/sale'

type ProductRouterParams = {
  service: SaleService
}

export const createSaleRouter = ({service}: ProductRouterParams) => {
  const {registerSale, findAll} = createSaleController({service})

  const router = new Router({prefix: '/sales'})
  router.post('/', validate(CreateSaleSchema), authenticate, registerSale)
  router.get('/', authenticate, findAll)

  return router
}
