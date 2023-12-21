import type {
  DeleteInventoryUseCase,
  GetAllInventoriesUseCase,
  RegisterInventoryUseCase,
  UpdateInventoryUseCase,
} from '~/usecases/inventory'
import type {UserContext} from '~/server/middlewares/authenticate'
import {buildResponse} from '~/server/response'
import {ControllerError} from './error'

export type InventoryService = {
  registerInventory: RegisterInventoryUseCase
  getAllInventories: GetAllInventoriesUseCase
  updateInventory: UpdateInventoryUseCase
  deleteInventory: DeleteInventoryUseCase
}

type InventoryControllerParams = {
  service: InventoryService
}

export const createInventoryController = ({
  service,
}: InventoryControllerParams) => {
  const registerInventory = async (ctx: UserContext) => {
    const inventory = await service.registerInventory(
      ctx.user?.email as string,
      ctx.request.body,
    )

    ctx.body = buildResponse({data: inventory})
    ctx.status = 201
  }

  const findAll = async (ctx: UserContext) => {
    const inventories = await service.getAllInventories(
      ctx.user?.email as string,
    )
    ctx.body = buildResponse({data: {inventories}})
  }

  const updateInventory = async (ctx: UserContext) => {
    const {inventoryCode} = ctx.params

    const inventory = await service.updateInventory(
      ctx.user?.email as string,
      inventoryCode,
      ctx.request.body,
    )

    ctx.body = buildResponse({data: inventory})
  }

  const deleteInventory = async (ctx: UserContext) => {
    const inventoryId = parseInt(ctx.params.id)
    if (isNaN(inventoryId)) {
      throw new ControllerError('Invalid param')
    }

    const inventory = await service.deleteInventory(
      ctx.user?.email as string,
      inventoryId,
    )

    ctx.body = buildResponse({data: inventory})
  }

  return {registerInventory, findAll, updateInventory, deleteInventory}
}
