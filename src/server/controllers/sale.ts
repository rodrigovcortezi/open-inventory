import type {RegisterSaleUseCase} from '~/usecases/sale'
import type {UserContext} from '../middlewares/authenticate'
import {buildResponse} from '../response'

export type SaleService = {
  registerSale: RegisterSaleUseCase
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

  return {registerSale}
}
