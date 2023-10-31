import {RegisterSupplierUseCase} from '~/usecases/supplier'
import {buildResponse} from '../response'
import type {UserContext} from '../middlewares/authenticate'

export type SupplierService = {
  registerSupplier: RegisterSupplierUseCase
}

type SupplierControllerParams = {
  service: SupplierService
}

export const createSupplierController = ({
  service,
}: SupplierControllerParams) => {
  const registerSupplier = async (ctx: UserContext) => {
    const supplier = await service.registerSupplier(
      ctx.user?.email as string,
      ctx.request.body,
    )
    ctx.body = buildResponse({data: supplier})
  }

  return {registerSupplier}
}
