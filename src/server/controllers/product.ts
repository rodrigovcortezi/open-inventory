import type {
  DeleteProductUseCase,
  RegisterProductUseCase,
  UpdateProductUseCase,
} from '~/usecases/product'
import {UserContext} from '~/server/middlewares/authenticate'
import {buildResponse} from '~/server/response'
import {ControllerError} from './error'

export type ProductService = {
  registerProduct: RegisterProductUseCase
  updateProduct: UpdateProductUseCase
  deleteProduct: DeleteProductUseCase
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

  const updateProduct = async (ctx: UserContext) => {
    const productId = parseInt(ctx.params.id)
    if (isNaN(productId)) {
      throw new ControllerError('Invalid param')
    }

    const product = await service.updateProduct(
      ctx.user?.email as string,
      productId,
      ctx.request.body,
    )
    ctx.body = buildResponse({data: product})
  }

  const deleteProduct = async (ctx: UserContext) => {
    const productId = parseInt(ctx.params.id)
    if (isNaN(productId)) {
      throw new ControllerError('Invalid param')
    }

    const product = await service.deleteProduct(
      ctx.user?.email as string,
      productId,
    )
    ctx.body = buildResponse({data: product})
  }

  return {registerProduct, updateProduct, deleteProduct}
}
