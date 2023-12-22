import {
  SupplyStatus,
  SupplyWithInventory,
  SupplyWithInventoryAndTransactions,
} from '~/models/supply'
import {prisma} from '.'
import type {
  CreateSupplyDTO,
  ReturnSupplyDTO,
  SupplyFilters,
  SupplyRepository,
} from '../supply'
import {TransactionType} from '~/models/inventory_transaction'

export const createSupplyRepository = (): SupplyRepository => ({
  create: async (data: CreateSupplyDTO) => {
    const {supply, transaction} = await prisma.$transaction(async tx => {
      const supply = await tx.supply.create({
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
          supplyId: supply.id,
          type: data.inventoryTransaction.type,
          items: {
            create: data.inventoryTransaction.items.map(i => ({
              ...i,
              quantity: i.quantity,
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
          await tx.inventoryProduct.create({
            data: {
              inventoryId: data.inventoryId,
              productId: item.product.id,
              quantity: item.quantity,
            },
          })
        } else {
          await tx.inventoryProduct.update({
            where: {id: inventoryProduct.id},
            data: {quantity: inventoryProduct.quantity + item.quantity},
          })
        }
      }

      return {supply, transaction}
    })

    return {
      ...supply,
      status: supply.status as SupplyStatus,
      transactions: [
        {...transaction, type: transaction.type as TransactionType},
      ],
    }
  },
  return: async (id: number, data: ReturnSupplyDTO) => {
    const {supply, transaction} = await prisma.$transaction(async tx => {
      const supply = await tx.supply.update({
        where: {id},
        data: {
          status: data.status,
        },
        include: {
          inventory: true,
          transactions: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      })
      const transaction = await tx.inventoryTransaction.create({
        data: {
          inventoryId: data.inventoryTransaction.inventoryId,
          userId: data.inventoryTransaction.userId,
          supplyId: supply.id,
          type: data.inventoryTransaction.type,
          items: {
            create: data.inventoryTransaction.items.map(i => ({
              ...i,
              quantity: i.quantity,
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
          where: {
            inventoryId: transaction.inventoryId,
            productId: item.product.id,
          },
        })
        if (!inventoryProduct) {
          throw new Error(
            'Could not find product in inventory while processing supply db transaction',
          )
        }
        await tx.inventoryProduct.update({
          where: {id: inventoryProduct.id},
          data: {quantity: inventoryProduct.quantity + item.quantity},
        })
      }

      return {supply, transaction}
    })

    const transactions = [transaction, ...supply.transactions]

    return {
      ...supply,
      transactions,
    } as SupplyWithInventoryAndTransactions
  },
  findById: async (id: number) => {
    const supply = await prisma.supply.findUnique({
      where: {id},
      include: {
        inventory: true,
        transactions: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
    return supply as SupplyWithInventoryAndTransactions | null
  },
  findByExternalId: async (externalId: string) => {
    const supply = await prisma.supply.findUnique({
      where: {external_id: externalId},
    })
    return supply ? {...supply, status: supply.status as SupplyStatus} : null
  },
  findByBusinessId: async (businessId: number, filters: SupplyFilters) => {
    const businessInventories = await prisma.inventory.findMany({
      where: {
        businessId,
        code: filters.inventoryCode,
      },
    })
    const supplies = await prisma.supply.findMany({
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

    return supplies as SupplyWithInventory[]
  },
})
