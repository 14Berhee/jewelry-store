/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Metal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Metal" ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Metal_slug_key" ON "Metal"("slug");

-- AddForeignKey
ALTER TABLE "Metal" ADD CONSTRAINT "Metal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
