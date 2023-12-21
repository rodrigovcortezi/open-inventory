import type {
  AdjustProductStockUseCase,
  GetInventoryTransactionsUseCase,
  GetInventoryWithProductsUseCase,
  GetProductWithAllInventoriesUseCase,
} from '~/usecases/inventory_product'
import type {UserContext} from '../middlewares/authenticate'
import {buildResponse} from '../response'

export type InventoryProductService = {
  adjustProductStock: AdjustProductStockUseCase
  getProductWithAllInventories: GetProductWithAllInventoriesUseCase
  getInventoryWithProducts: GetInventoryWithProductsUseCase
  getInventoryTransactions: GetInventoryTransactionsUseCase
}

type InventoryProductControllerParams = {
  service: InventoryProductService
}

export const createInventoryProductController = ({
  service,
}: InventoryProductControllerParams) => {
  const getProductWithInventories = async (ctx: UserContext) => {
    const {productSku} = ctx.params

    const product = await service.getProductWithAllInventories(
      ctx.user?.email as string,
      productSku,
    )
    ctx.body = buildResponse({data: product})
  }

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
    const productSku = ctx.query.productSKU as string | undefined
    const fromDate = ctx.query.fromDate
      ? new Date(ctx.query.fromDate as string)
      : undefined
    const toDate = ctx.query.toDate
      ? new Date(ctx.query.toDate as string)
      : undefined

    const movements = await service.getInventoryTransactions(
      ctx.user?.email as string,
      inventoryCode,
      {productSku, fromDate, toDate},
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

  return {
    getProductWithInventories,
    getInventory,
    getInventoryTransactions,
    adjustProductStock,
  }
}
