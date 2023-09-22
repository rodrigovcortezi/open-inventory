/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Business` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Business_cnpj_key" ON "Business"("cnpj");
