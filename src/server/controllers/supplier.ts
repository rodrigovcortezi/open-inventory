import {
  DeleteSupplierUseCase,
  RegisterSupplierUseCase,
} from '~/usecases/supplier'
import {buildResponse} from '../response'
import type {UserContext} from '../middlewares/authenticate'
import {ControllerError} from './error'

export type SupplierService = {
  registerSupplier: RegisterSupplierUseCase
  deleteSupplier: DeleteSupplierUseCase
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

  const deleteSupplier = async (ctx: UserContext) => {
    const supplierId = parseInt(ctx.params.id)
    if (isNaN(supplierId)) {
      throw new ControllerError('Invalid param')
    }

    const supplier = await service.deleteSupplier(
      ctx.user?.email as string,
      supplierId,
    )
    ctx.body = buildResponse({data: supplier})
  }

  return {registerSupplier, deleteSupplier}
}