import type {
  InventoryTransactionWithItems,
  TransactionType,
} from '~/models/inventory_transaction'
import {prisma} from '.'
import type {
  CreateInventoryTransactionDTO,
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
    findByInventoryId: async (inventoryId: number) => {
      const transactions = await prisma.inventoryTransaction.findMany({
        where: {inventoryId},
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

      return transactions as InventoryTransactionWithItems[]
    },
    findByInventoryIdAndProductSupplier: async (
      inventoryId: number,
      supplierId: number,
    ) => {
      const transactions = await prisma.inventoryTransaction.findMany({
        where: {
          inventoryId,
          items: {
            some: {
              product: {
                supplierId,
              },
            },
          },
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

      const filteredTransactions = transactions.map(t => ({
        ...t,
        items: t.items.filter(i => i.product.supplierId === supplierId),
      }))
      return filteredTransactions as InventoryTransactionWithItems[]
    },
  })
