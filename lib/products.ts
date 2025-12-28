import { prisma } from './prisma';

export async function getProduct() {
  // Skip database calls during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
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
