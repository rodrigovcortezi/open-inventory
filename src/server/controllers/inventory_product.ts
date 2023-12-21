import {AdjustProductStockUseCase} from '~/usecases/inventory_product'
import type {UserContext} from '../middlewares/authenticate'
import {buildResponse} from '../response'

export type InventoryProductService = {
  adjustProductStock: AdjustProductStockUseCase
}

type InventoryProductControllerParams = {
  service: InventoryProductService
}

export const createInventoryProductController = ({
  service,
}: InventoryProductControllerParams) => {
  const adjustProductStock = async (ctx: UserContext) => {
    const {inventoryCode, productSku} = ctx.params

    const inventoryProduct = await service.adjustProductStock(
      ctx.user?.email as string,
      inventoryCode,
      productSku,
      ctx.request.body,
    )

    ctx.body = buildResponse({data: inventoryProduct})
    ctx.status = 201
  }

  return {adjustProductStock}
}
