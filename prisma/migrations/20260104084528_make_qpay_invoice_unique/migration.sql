/*
  Warnings:

  - A unique constraint covering the columns `[qpayInvoiceId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Order_qpayInvoiceId_key" ON "Order"("qpayInvoiceId");
