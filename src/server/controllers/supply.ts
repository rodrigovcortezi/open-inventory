import type {
  GetAllSuppliesUseCase,
  GetSupplyUseCase,
  RegisterSupplyUseCase,
  ReturnSupplyUseCase,
} from '~/usecases/supply'
import type {UserContext} from '../middlewares/authenticate'
import {buildResponse} from '../response'
import {ControllerError} from './error'

export type SupplyService = {
  registerSupply: RegisterSupplyUseCase
  getAllSupplies: GetAllSuppliesUseCase
  returnSupply: ReturnSupplyUseCase
  getSupply: GetSupplyUseCase
}

type SupplyControllerParams = {
  service: SupplyService
}

export const createSupplyController = ({service}: SupplyControllerParams) => {
  const registerSupply = async (ctx: UserContext) => {
    const supply = await service.registerSupply(
      ctx.user?.email as string,
      ctx.request.body,
    )
    ctx.body = buildResponse({data: supply})
    ctx.status = 201
  }

  const findAll = async (ctx: UserContext) => {
    const inventoryCode = ctx.query.inventoryCode as string | undefined
    const fromDate = ctx.query.fromDate
      ? new Date(ctx.query.fromDate as string)
      : undefined
    const toDate = ctx.query.toDate
      ? new Date(ctx.query.toDate as string)
      : undefined

    const supplies = await service.getAllSupplies(ctx.user?.email as string, {
      inventoryCode,
      fromDate,
      toDate,
    })
    ctx.body = buildResponse({data: {supplies}})
  }

  const returnSupply = async (ctx: UserContext) => {
    const id = parseInt(ctx.params.id, 10)
    if (isNaN(id)) {
      throw new ControllerError('Id must be an integer number')
    }

    const supply = await service.returnSupply(ctx.user?.email as string, id)
    ctx.body = buildResponse({data: supply})
  }

  const getSupply = async (ctx: UserContext) => {
    const id = parseInt(ctx.params.id, 10)
    if (isNaN(id)) {
      throw new ControllerError('Id must be an integer number')
    }

    const supply = await service.getSupply(ctx.user?.email as string, id)
    ctx.body = buildResponse({data: supply})
  }

  return {registerSupply, findAll, returnSupply, getSupply}
}
