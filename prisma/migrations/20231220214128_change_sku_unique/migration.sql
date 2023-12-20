/*
  Warnings:

  - A unique constraint covering the columns `[ean]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku,businessId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_sku_key";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "ean" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_ean_key" ON "Product"("ean");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_businessId_key" ON "Product"("sku", "businessId");
