import Router from 'koa-router'
import {
  createInventoryController,
  type InventoryService,
} from '~/server/controllers/inventory'
import {validate} from '~/server/middlewares/validate'
import {
  CreateInventorySchema,
  UpdateInventorySchema,
} from '~/server/schemas/inventory'
import {authenticate} from '~/server/middlewares/authenticate'

type InventoryRouterParams = {
  service: InventoryService
}

export const createInventoryRouter = ({service}: InventoryRouterParams) => {
  const {registerInventory, findAll, updateInventory, deleteInventory} =
    createInventoryController({service})

  const router = new Router({prefix: '/inventories'})
  router.post(
    '/',
    validate(CreateInventorySchema),
    authenticate,
    registerInventory,
  )
  router.get('/', authenticate, findAll)
  router.put(
    '/:inventoryCode',
    validate(UpdateInventorySchema),
    authenticate,
    updateInventory,
  )
  router.delete('/:id', authenticate, deleteInventory)

  return router
}
