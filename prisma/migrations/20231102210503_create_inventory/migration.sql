-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "businessId" INTEGER NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_code_key" ON "Inventory"("code");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
