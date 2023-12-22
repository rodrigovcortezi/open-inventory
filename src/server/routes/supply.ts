import Router from 'koa-router'
import {authenticate} from '~/server/middlewares/authenticate'
import {validate} from '~/server/middlewares/validate'
import {type SupplyService, createSupplyController} from '../controllers/supply'
import {CreateSupplySchema} from '../schemas/supply'

type ProductRouterParams = {
  service: SupplyService
}

export const createSupplyRouter = ({service}: ProductRouterParams) => {
  const {registerSupply, findAll, returnSupply, getSupply} =
    createSupplyController({
      service,
    })

  const router = new Router({prefix: '/supplies'})
  router.post('/', validate(CreateSupplySchema), authenticate, registerSupply)
  router.get('/', authenticate, findAll)
  router.post('/:id/return', authenticate, returnSupply)
  router.get('/:id', authenticate, getSupply)

  return router
}
