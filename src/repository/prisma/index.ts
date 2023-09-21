import {createUserRepository} from './user'

export const createPrismaRepository = () => {
  const userRepository = createUserRepository()
  return {
    userRepository,
  }
}
