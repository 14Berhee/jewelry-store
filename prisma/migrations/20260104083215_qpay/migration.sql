/*
  Warnings:

  - You are about to drop the column `paymentRef` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentRef",
ADD COLUMN     "qpayInvoiceId" TEXT,
ADD COLUMN     "qpayQr" TEXT;
