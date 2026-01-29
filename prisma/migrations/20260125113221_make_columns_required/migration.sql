/*
  Warnings:

  - Made the column `categoryId` on table `Metal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `Metal` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Metal" DROP CONSTRAINT "Metal_categoryId_fkey";

-- AlterTable
ALTER TABLE "Metal" ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "slug" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Metal" ADD CONSTRAINT "Metal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
