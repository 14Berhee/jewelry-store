import prisma from './prisma';

export async function getProduct() {
  return await prisma.product.findMany({
    include: {
      images: true,
      category: true,
      metal: true,
    },
  });
}
