-- CreateEnum
CREATE TYPE "SupplyStatus" AS ENUM ('EXECUTED', 'RETURNED');

-- AlterTable
ALTER TABLE "InventoryTransaction" ADD COLUMN     "supplyId" INTEGER;

-- CreateTable
CREATE TABLE "Supply" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT,
    "status" "SaleStatus" NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supply_external_id_key" ON "Supply"("external_id");

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_supplyId_fkey" FOREIGN KEY ("supplyId") REFERENCES "Supply"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supply" ADD CONSTRAINT "Supply_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
