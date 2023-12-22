import {createBusinessRepository} from './repository/prisma/business'
import {createInventoryRepository} from './repository/prisma/inventory'
import {createInventoryProductRepository} from './repository/prisma/inventory_product'
import {createInventoryTransactionRepository} from './repository/prisma/inventory_transaction'
import {createProductRepository} from './repository/prisma/product'
import {createSaleRepository} from './repository/prisma/sale'
import {createSupplierRepository} from './repository/prisma/supplier'
import {createSupplyRepository} from './repository/prisma/supply'
import {createUserRepository} from './repository/prisma/user'
import {createServer} from './server'
import {createInventoryService} from './usecases/inventory'
import {createInventoryProductService} from './usecases/inventory_product'
import {createProductService} from './usecases/product'
import {createSaleService} from './usecases/sale'
import {createSupplierService} from './usecases/supplier'
import {createSupplyService} from './usecases/supply'
import {createUserService} from './usecases/users'

const userRepository = createUserRepository()
const businessRepository = createBusinessRepository()
const supplierRepository = createSupplierRepository()
const productRepository = createProductRepository()
const inventoryRepository = createInventoryRepository()
const inventoryProductRepository = createInventoryProductRepository()
const inventoryTransactionRepository = createInventoryTransactionRepository()
const saleRepository = createSaleRepository()
const supplyRepository = createSupplyRepository()

const userService = createUserService({
  userRepository,
  businessRepository,
  supplierRepository,
})
const supplierService = createSupplierService({
  userRepository,
  supplierRepository,
})
const productService = createProductService({
  userRepository,
  productRepository,
  supplierRepository,
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
  inventoryTransactionRepository,
})
const saleService = createSaleService({
  userRepository,
  inventoryRepository,
  productRepository,
  inventoryProductRepository,
  saleRepository,
})
const supplyService = createSupplyService({
  userRepository,
  inventoryRepository,
  productRepository,
  supplyRepository,
})

const server = createServer({
  config: {port: 3000},
  userService,
  supplierService,
  productService,
  inventoryService,
  inventoryProductService,
  saleService,
  supplyService,
})

server.init()
