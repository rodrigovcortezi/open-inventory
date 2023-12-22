import type {GetAllSalesUseCase, RegisterSaleUseCase} from '~/usecases/sale'
import type {UserContext} from '../middlewares/authenticate'
import {buildResponse} from '../response'

export type SaleService = {
  registerSale: RegisterSaleUseCase
  getAllSales: GetAllSalesUseCase
}

type SaleControllerParams = {
  service: SaleService
}

export const createSaleController = ({service}: SaleControllerParams) => {
  const registerSale = async (ctx: UserContext) => {
    const sale = await service.registerSale(
      ctx.user?.email as string,
      ctx.request.body,
    )
    ctx.body = buildResponse({data: sale})
    ctx.status = 201
  }

  const findAll = async (ctx: UserContext) => {
    const inventoryCode = ctx.query.inventoryCode as string | undefined
    const fromDate = ctx.query.fromDate
      ? new Date(ctx.query.fromDate as string)
      : undefined
    const toDate = ctx.query.toDate
      ? new Date(ctx.query.toDate as string)
      : undefined

    const sales = await service.getAllSales(ctx.user?.email as string, {
      inventoryCode,
      fromDate,
      toDate,
    })
    ctx.body = buildResponse({data: {sales}})
  }

  return {registerSale, findAll}
}
