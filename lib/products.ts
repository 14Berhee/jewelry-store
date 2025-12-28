// lib/queries.ts or wherever your queries are
import { prisma } from './prisma';

export async function getProduct() {
  // Skip database calls during build
  if (process.env.VERCEL_ENV === 'production' && !process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await prisma.product.findMany({
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

export async function getCategories() {
  if (process.env.VERCEL_ENV === 'production' && !process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await prisma.category.findMany();
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}
