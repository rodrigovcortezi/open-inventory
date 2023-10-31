import {createBusinessRepository} from './repository/prisma/business'
import {createSupplierRepository} from './repository/prisma/supplier'
import {createUserRepository} from './repository/prisma/user'
import {createServer} from './server'
import {createBusinessService} from './usecases/business'
import {createSupplierService} from './usecases/supplier'
import {createUserService} from './usecases/users'

const userRepository = createUserRepository()
const businessRepository = createBusinessRepository()
const supplierRepository = createSupplierRepository()

const userService = createUserService({userRepository, businessRepository})
const businessService = createBusinessService({
  userRepository,
  businessRepository,
})
const supplierService = createSupplierService({
  userRepository,
  supplierRepository,
})
const server = createServer({
  config: {port: 3000},
  userService,
  businessService,
  supplierService,
})

server.init()
