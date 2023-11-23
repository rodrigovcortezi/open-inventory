import {createBusinessRepository} from './repository/prisma/business'
import {createInventoryRepository} from './repository/prisma/inventory'
import {createInventoryProductRepository} from './repository/prisma/inventory_product'
import {createProductRepository} from './repository/prisma/product'
import {createSupplierRepository} from './repository/prisma/supplier'
import {createUserRepository} from './repository/prisma/user'
import {createServer} from './server'
import {createBusinessService} from './usecases/business'
import {createInventoryService} from './usecases/inventory'
import {createInventoryProductService} from './usecases/inventory_product'
import {createProductService} from './usecases/product'
import {createSupplierService} from './usecases/supplier'
import {createUserService} from './usecases/users'

const userRepository = createUserRepository()
const businessRepository = createBusinessRepository()
const supplierRepository = createSupplierRepository()
const productRepository = createProductRepository()
const inventoryRepository = createInventoryRepository()
const inventoryProductRepository = createInventoryProductRepository()

const userService = createUserService({userRepository, businessRepository})
const businessService = createBusinessService({
  userRepository,
  businessRepository,
})
const supplierService = createSupplierService({
  userRepository,
  supplierRepository,
})
const productService = createProductService({
  userRepository,
  productRepository,
})
const inventoryService = createInventoryService({
  userRepository,
  inventoryRepository,
})
const inventoryProductService = createInventoryProductService({
  userRepository,
  inventoryRepository,
  productRepository,
  inventoryProductRepository,
})

const server = createServer({
  config: {port: 3000},
  userService,
  businessService,
  supplierService,
  productService,
  inventoryService,
  inventoryProductService,
})

server.init()
