import {createBusinessRepository} from './repository/prisma/business'
import {createUserRepository} from './repository/prisma/user'
import {createServer} from './server'
import {createUserService} from './usecases/users'

const userRepository = createUserRepository()
const businessRepository = createBusinessRepository()

const userService = createUserService({userRepository, businessRepository})
const server = createServer({config: {port: 3000}, userService})

server.init()
