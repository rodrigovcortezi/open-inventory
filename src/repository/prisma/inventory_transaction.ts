import type {TransactionType} from '~/models/inventory_transaction'
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
  })
