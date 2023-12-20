import type {
  DeleteSupplierUseCase,
  GetAllBusinessSuppliersUseCase,
  RegisterSupplierUseCase,
  UpdateSupplierUseCase,
} from '~/usecases/supplier'
import {buildResponse} from '../response'
import type {UserContext} from '../middlewares/authenticate'
import {ControllerError} from './error'

export type SupplierService = {
  registerSupplier: RegisterSupplierUseCase
  updateSupplier: UpdateSupplierUseCase
  getAllBusinessSuppliers: GetAllBusinessSuppliersUseCase
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
    ctx.status = 201
  }

  const updateSupplier = async (ctx: UserContext) => {
    const {supplierCode} = ctx.params
    const supplier = await service.updateSupplier(
      ctx.user?.email as string,
      supplierCode,
      ctx.request.body,
    )
    ctx.body = buildResponse({data: supplier})
  }

  const findAll = async (ctx: UserContext) => {
    const suppliers = await service.getAllBusinessSuppliers(
      ctx.user?.email as string,
    )
    ctx.body = buildResponse({data: {suppliers}})
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

  return {registerSupplier, updateSupplier, findAll, deleteSupplier}
}
