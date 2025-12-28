import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export async function getProduct() {
  return await prisma.product.findMany({
    include: {
      images: true,
      category: true,
      metal: true,
    },
  });
}

// Using Prisma types
export async function createProduct(data: Prisma.ProductCreateInput) {
  return await prisma.product.create({ data });
}
