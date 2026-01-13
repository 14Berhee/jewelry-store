import { prisma } from './prisma';

export async function getAllProducts() {
  return prisma.product.findMany({
    include: {
      images: true,
      category: true,
      metal: true,
    },
  });
}

export async function getSingleProduct(id: string) {
  return prisma.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      images: true,
      category: true,
      metal: true,
    },
  });
}

export async function getProductsByCategory(slug: string) {
  if (process.env.VERCEL_ENV === 'production' && !process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await prisma.product.findMany({
      where: {
        category: {
          slug: {
            equals: slug,
            mode: 'insensitive',
          },
        },
      },
      include: {
        images: true,
        category: true,
        metal: true,
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}
