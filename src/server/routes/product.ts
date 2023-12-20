import Router from 'koa-router'
import {
  createProductController,
  type ProductService,
} from '~/server/controllers/product'
import {authenticate} from '~/server/middlewares/authenticate'
import {validate} from '~/server/middlewares/validate'
import {
  CreateProductSchema,
  UpdateProductSchema,
} from '~/server/schemas/product'

type ProductRouterParams = {
  service: ProductService
}

export const createProductRouter = ({service}: ProductRouterParams) => {
  const {registerProduct, findAllProducts, updateProduct, deleteProduct} =
    createProductController({service})

  const router = new Router({prefix: '/products'})
  router.post('/', validate(CreateProductSchema), authenticate, registerProduct)
  router.get('/', authenticate, findAllProducts)
  router.put('/:id', validate(UpdateProductSchema), authenticate, updateProduct)
  router.delete('/:id', authenticate, deleteProduct)

  return router
}
