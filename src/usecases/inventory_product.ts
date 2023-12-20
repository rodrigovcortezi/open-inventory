import type {InventoryProductWithoutRelations} from '~/models/inventory_product'
import type {UserRepository} from '~/repository/user'
import type {InventoryRepository} from '~/repository/inventory'
import type {ProductRepository} from '~/repository/product'
import type {InventoryProductRepository} from '~/repository/inventory_product'
import {ServiceError} from './error'

type InventoryProductServiceParams = {
  userRepository: UserRepository
  inventoryRepository: InventoryRepository
  productRepository: ProductRepository
  inventoryProductRepository: InventoryProductRepository
}

type AdjustmentDTO = {
  inventoryCode: string
  productSku: string
  quantity: number
}

export type AdjustProductStockUseCase = (
  loggedUserEmail: string,
  data: AdjustmentDTO,
) => Promise<InventoryProductWithoutRelations>

export const createInventoryProductService = ({
  userRepository,
  inventoryRepository,
  productRepository,
  inventoryProductRepository,
}: InventoryProductServiceParams) => ({
  adjustProductStock: async (loggedUserEmail: string, data: AdjustmentDTO) => {
    const user = await userRepository.findByEmail(loggedUserEmail)
    if (!user) {
      throw new ServiceError('User not found', 404)
    }

    const {inventoryCode} = data
    const inventory = await inventoryRepository.findByCode(inventoryCode)
    if (!inventory) {
      throw new ServiceError('Inventory not found', 404)
    }

    if (inventory.business.id !== user.business.id) {
      throw new ServiceError('Inventory does not belong to user business', 403)
    }

    const {productSku} = data
    const product = await productRepository.findBySku(productSku)
    if (!product) {
      throw new ServiceError('Product not found', 404)
    }

    if (product.businessId !== user.business.id) {
      throw new ServiceError('Product does not belong to user business', 403)
    }

    const inventoryProduct = await inventoryProductRepository.findByProductId(
      product.id,
    )

    const quantity = (inventoryProduct?.quantity ?? 0) + data.quantity
    if (quantity < 0) {
      throw new ServiceError(
        'The resulting quantity of the product cannot be negative',
        422,
      )
    }

    let changedInventoryProduct: InventoryProductWithoutRelations
    if (!inventoryProduct) {
      changedInventoryProduct = await inventoryProductRepository.create({
        inventoryId: inventory.id,
        productId: product.id,
        quantity,
      })
    } else {
      changedInventoryProduct = await inventoryProductRepository.update(
        inventoryProduct.id,
        {quantity},
      )
    }

    return changedInventoryProduct
  },
})
