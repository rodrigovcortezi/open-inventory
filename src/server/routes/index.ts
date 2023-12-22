import Router from 'koa-router'
import {createUserRouter} from './users'
import type {UserService} from '~/server/controllers/user'
import type {SupplierService} from '~/server/controllers/supplier'
import {createSupplierRouter} from './supplier'
import {createProductRouter} from './product'
import type {ProductService} from '~/server/controllers/product'
import {createInventoryRouter} from './inventory'
import type {InventoryService} from '~/server/controllers/inventory'
import {createInventoryProductRouter} from './inventory_product'
import type {InventoryProductService} from '../controllers/inventory_product'
import type {SaleService} from '../controllers/sale'
import {createSaleRouter} from './sale'
import type {SupplyService} from '../controllers/supply'
import {createSupplyRouter} from './supply'

type RouterParams = {
  userService: UserService
  supplierService: SupplierService
  productService: ProductService
  inventoryService: InventoryService
  inventoryProductService: InventoryProductService
  saleService: SaleService
  supplyService: SupplyService
}

export const createRouter = ({
  userService,
  supplierService,
  productService,
  inventoryService,
  inventoryProductService,
  saleService,
  supplyService,
}: RouterParams) => {
  const mainRouter = new Router()
  const userRouter = createUserRouter({service: userService})
  const supplierRouter = createSupplierRouter({service: supplierService})
  const productRouter = createProductRouter({service: productService})
  const inventoryRouter = createInventoryRouter({service: inventoryService})
  const inventoryProductRouter = createInventoryProductRouter({
    service: inventoryProductService,
  })
  const saleRouter = createSaleRouter({service: saleService})
  const supplyRouter = createSupplyRouter({service: supplyService})

  mainRouter.use(userRouter.routes())
  mainRouter.use(supplierRouter.routes())
  mainRouter.use(productRouter.routes())
  mainRouter.use(inventoryRouter.routes())
  mainRouter.use(inventoryProductRouter.routes())
  mainRouter.use(saleRouter.routes())
  mainRouter.use(supplyRouter.routes())

  return mainRouter
}
