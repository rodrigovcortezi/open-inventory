import {Business} from '~/models/business'
import {BusinessRepository} from '~/repository/business'
import {UserRepository} from '~/repository/user'
import {ServiceError} from './error'

type SafeBusiness = Omit<Business, 'id'>

type UpdateBusinessDTO = {
  name?: string
  cnpj?: string
}

export type UpdateBusinessUseCase = (
  loggedUserEmail: string,
  business: UpdateBusinessDTO,
) => Promise<SafeBusiness>

type BusinessServiceParams = {
  userRepository: UserRepository
  businessRepository: BusinessRepository
}

const filterSensitiveData = (business: Business) => {
  const {name, cnpj} = business
  return {name, cnpj}
}

export const createBusinessService = ({
  userRepository,
  businessRepository,
}: BusinessServiceParams) => ({
  updateBusiness: async (
    loggedUserEmail: string,
    businessData: UpdateBusinessDTO,
  ) => {
    const user = await userRepository.findByEmail(loggedUserEmail)
    if (!user) {
      throw new ServiceError('User not found', 404)
    }

    const businessId = user.business.id
    if (!businessId) {
      throw new ServiceError('Business not found', 500)
    }

    const business = await businessRepository.update(businessId, businessData)
    return filterSensitiveData(business)
  },
})
