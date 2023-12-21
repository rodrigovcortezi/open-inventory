import type {
  InventoryTransactionWithItems,
  TransactionType,
} from '~/models/inventory_transaction'
import {prisma} from '.'
import type {
  CreateInventoryTransactionDTO,
  TransactionFilters,
  InventoryTransactionRepository,
} from '../inventory_transaction'

export const createInventoryTransactionRepository =
  (): InventoryTransactionRepository => ({
    create: async (data: CreateInventoryTransactionDTO) => {
      const transaction = await prisma.inventoryTransaction.create({
        data: {
          inventoryId: data.inventoryId,
          userId: data.userId,
          type: data.type,
          items: {
            create: data.items,
          },
        },
      })

      return {...transaction, type: transaction.type as TransactionType}
    },
    findByInventoryId: async (
      inventoryId: number,
      filters: TransactionFilters,
    ) => {
      const transactions = await prisma.inventoryTransaction.findMany({
        where: {
          inventoryId,
          items: filters.product
            ? {
                some: {
                  product: {
                    sku: filters.product.sku,
                    supplierId: filters.product.supplierId,
                  },
                },
              }
            : undefined,
          createdAt: filters.date
            ? {
                gte: filters.date.from,
                lte: filters.date.to,
              }
            : undefined,
        },
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
      })

      let filteredTransactions = transactions
      const skuFilter = filters.product?.sku
      if (skuFilter) {
        filteredTransactions = filteredTransactions.map(t => ({
          ...t,
          items: t.items.filter(i => i.product.sku === skuFilter),
        }))
      }

      const supplierFilter = filters.product?.supplierId
      if (supplierFilter) {
        filteredTransactions = filteredTransactions.map(t => ({
          ...t,
          items: t.items.filter(i => i.product.supplierId === supplierFilter),
        }))
      }

      return filteredTransactions as InventoryTransactionWithItems[]
    },
  })
