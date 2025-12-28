-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "metalId" INTEGER;

-- CreateTable
CREATE TABLE "Metal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Metal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metal_name_key" ON "Metal"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_metalId_fkey" FOREIGN KEY ("metalId") REFERENCES "Metal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
