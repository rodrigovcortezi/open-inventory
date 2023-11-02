import type {RegisterProductUseCase} from '~/usecases/product'
import {UserContext} from '~/server/middlewares/authenticate'
import {buildResponse} from '~/server/response'

export type ProductService = {
  registerProduct: RegisterProductUseCase
}

type ProductControllerParams = {
  service: ProductService
}

export const createProductController = ({service}: ProductControllerParams) => {
  const registerProduct = async (ctx: UserContext) => {
    const product = await service.registerProduct(
      ctx.user?.email as string,
      ctx.request.body,
    )
    ctx.body = buildResponse({data: product})
  }

  return {registerProduct}
}
