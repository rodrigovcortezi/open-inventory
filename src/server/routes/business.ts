import {
  BusinessService,
  createBusinessController,
} from '../controllers/business'
import Router from 'koa-router'
import {validate} from '../middlewares/validate'
import {PartialBusinessSchema} from '../schemas/business'
import {authenticate} from '../middlewares/authenticate'

type BusinessRouterParams = {
  service: BusinessService
}

export const createBusinessRouter = ({service}: BusinessRouterParams) => {
  const {updateBusiness} = createBusinessController({service})

  const router = new Router({prefix: '/business'})
  router.put('/', validate(PartialBusinessSchema), authenticate, updateBusiness)

  return router
}
