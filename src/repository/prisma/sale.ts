import {SaleStatus, SaleWithInventory} from '~/models/sale'
import {prisma} from '.'
import type {CreateSaleDTO, SaleFilters, SaleRepository} from '../sale'
import {TransactionType} from '~/models/inventory_transaction'

export const createSaleRepository = (): SaleRepository => ({
  create: async (data: CreateSaleDTO) => {
    const {sale, transaction} = await prisma.$transaction(async tx => {
      const sale = await tx.sale.create({
        data: {
          external_id: data.external_id,
          status: data.status,
          inventoryId: data.inventoryId,
        },
      })
      const transaction = await tx.inventoryTransaction.create({
        data: {
          inventoryId: data.inventoryTransaction.inventoryId,
          userId: data.inventoryTransaction.userId,
          saleId: sale.id,
          type: data.inventoryTransaction.type,
          items: {
            create: data.inventoryTransaction.items.map(i => ({
              ...i,
              quantity: -i.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
      for (const item of transaction.items) {
        const inventoryProduct = await tx.inventoryProduct.findFirst({
          where: {inventoryId: data.inventoryId, productId: item.product.id},
        })
        if (!inventoryProduct) {
          throw new Error(
            'Could not find product in inventory while processing sale db transaction',
          )
        }
        await tx.inventoryProduct.update({
          where: {id: inventoryProduct.id},
          data: {quantity: inventoryProduct.quantity + item.quantity},
        })
      }

      return {sale, transaction}
    })

    return {
      ...sale,
      status: sale.status as SaleStatus,
      transactions: [
        {...transaction, type: transaction.type as TransactionType},
      ],
    }
  },
  findByExternalId: async (externalId: string) => {
    const sale = await prisma.sale.findUnique({
      where: {external_id: externalId},
    })
    return sale ? {...sale, status: sale.status as SaleStatus} : null
  },
  findByBusinessId: async (businessId: number, filters: SaleFilters) => {
    const businessInventories = await prisma.inventory.findMany({
      where: {
        businessId,
        code: filters.inventoryCode,
      },
    })
    const sales = await prisma.sale.findMany({
      where: {
        inventoryId: {
          in: businessInventories.map(i => i.id),
        },
        createdAt: {
          gte: filters.fromDate,
          lte: filters.toDate,
        },
      },
      include: {inventory: true},
    })

    return sales as SaleWithInventory[]
  },
})
