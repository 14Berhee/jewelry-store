/*
  Warnings:

  - Made the column `city` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "district" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;
