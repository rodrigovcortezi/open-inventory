import type {
  DeleteProductUseCase,
  GetAllProductsUseCase,
  RegisterProductUseCase,
  UpdateProductUseCase,
} from '~/usecases/product'
import {UserContext} from '~/server/middlewares/authenticate'
import {buildResponse} from '~/server/response'

export type ProductService = {
  registerProduct: RegisterProductUseCase
  getAllProducts: GetAllProductsUseCase
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
    ctx.status = 201
  }

  const findAllProducts = async (ctx: UserContext) => {
    const products = await service.getAllProducts(ctx.user?.email as string)
    ctx.body = buildResponse({data: {products}})
  }

  const updateProduct = async (ctx: UserContext) => {
    const {productSku} = ctx.params
    const product = await service.updateProduct(
      ctx.user?.email as string,
      productSku,
      ctx.request.body,
    )
    ctx.body = buildResponse({data: product})
  }

  const deleteProduct = async (ctx: UserContext) => {
    const {productSku} = ctx.params

    const product = await service.deleteProduct(
      ctx.user?.email as string,
      productSku,
    )
    ctx.body = buildResponse({data: product})
  }

  return {registerProduct, findAllProducts, updateProduct, deleteProduct}
}
