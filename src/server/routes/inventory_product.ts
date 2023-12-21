import Router from 'koa-router'
import {
  createInventoryProductController,
  type InventoryProductService,
} from '~/server/controllers/inventory_product'
import {authenticate} from '../middlewares/authenticate'
import {validate} from '../middlewares/validate'
import {InventoryProductSchema} from '../schemas/inventory_product'

type InventoryProductRouterParams = {
  service: InventoryProductService
}

export const createInventoryProductRouter = ({
  service,
}: InventoryProductRouterParams) => {
  const {adjustProductStock, getInventory, getInventoryTransactions} =
    createInventoryProductController({
      service,
    })

  const router = new Router({prefix: '/inventories'})
  router.post(
    '/:inventoryCode/products/:productSku',
    validate(InventoryProductSchema),
    authenticate,
    adjustProductStock,
  )
  router.get('/:inventoryCode/products', authenticate, getInventory)
  router.get(
    '/:inventoryCode/movements',
    authenticate,
    getInventoryTransactions,
  )

  return router
}
