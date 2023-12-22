-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('EXECUTED', 'RETURNED');

-- AlterTable
ALTER TABLE "InventoryTransaction" ADD COLUMN     "saleId" INTEGER;

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT,
    "status" "SaleStatus" NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sale_external_id_key" ON "Sale"("external_id");

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
