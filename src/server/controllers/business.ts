import {UpdateBusinessUseCase} from '~/usecases/business'
import type {UserContext} from '../middlewares/authenticate'
import {buildResponse} from '../response'

export type BusinessService = {
  updateBusiness: UpdateBusinessUseCase
}

type BusinessControllerParams = {
  service: BusinessService
}

export const createBusinessController = ({
  service,
}: BusinessControllerParams) => {
  const updateBusiness = async (ctx: UserContext) => {
    const business = await service.updateBusiness(
      ctx.user?.email as string,
      ctx.request.body,
    )
    ctx.body = buildResponse({data: business})
  }

  return {updateBusiness}
}
