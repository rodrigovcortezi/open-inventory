import type {
  AdjustProductStockUseCase,
  GetInventoryTransactionsUseCase,
  GetInventoryWithProductsUseCase,
} from '~/usecases/inventory_product'
import type {UserContext} from '../middlewares/authenticate'
import {buildResponse} from '../response'

export type InventoryProductService = {
  adjustProductStock: AdjustProductStockUseCase
  getInventoryWithProducts: GetInventoryWithProductsUseCase
  getInventoryTransactions: GetInventoryTransactionsUseCase
}

type InventoryProductControllerParams = {
  service: InventoryProductService
}

export const createInventoryProductController = ({
  service,
}: InventoryProductControllerParams) => {
  const getInventory = async (ctx: UserContext) => {
    const {inventoryCode} = ctx.params
    const {productSku} = ctx.query

    const inventoryWithProducts = await service.getInventoryWithProducts(
      ctx.user?.email as string,
      inventoryCode,
      productSku as string,
    )
    ctx.body = buildResponse({data: inventoryWithProducts})
  }

  const getInventoryTransactions = async (ctx: UserContext) => {
    const {inventoryCode} = ctx.params

    const movements = await service.getInventoryTransactions(
      ctx.user?.email as string,
      inventoryCode,
    )
    ctx.body = buildResponse({data: {movements}})
  }

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

  return {getInventory, getInventoryTransactions, adjustProductStock}
}
