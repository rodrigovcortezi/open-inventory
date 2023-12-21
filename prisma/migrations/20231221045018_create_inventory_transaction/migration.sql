-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ADJUSTMENT', 'SALE', 'SUPPLY', 'SALE_RETURN', 'SUPPLY_RETURN');

-- CreateTable
CREATE TABLE "InventoryTransaction" (
    "id" SERIAL NOT NULL,
    "type" "TransactionType" NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransactionItem" (
    "inventoryTransactionId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "InventoryTransactionItem_pkey" PRIMARY KEY ("inventoryTransactionId","productId")
);

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransactionItem" ADD CONSTRAINT "InventoryTransactionItem_inventoryTransactionId_fkey" FOREIGN KEY ("inventoryTransactionId") REFERENCES "InventoryTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransactionItem" ADD CONSTRAINT "InventoryTransactionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
