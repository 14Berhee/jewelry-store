import { prisma } from './prisma';

export async function getAllProducts() {
  return await prisma.product.findMany({
    where: { deletedAt: null },
    include: {
      images: { orderBy: { order: 'asc' } },
      metal: true,
      category: true,
    },
  });
}

export async function getSingleProduct(id: string) {
  return await prisma.product.findFirst({
    where: {
      id: parseInt(id),
      deletedAt: null,
    },
    include: {
      images: { orderBy: { order: 'asc' } },
      metal: true,
      category: true,
    },
  });
}

export async function getProductsByCategory(slug: string, metalSlug?: string) {
  if (process.env.VERCEL_ENV === 'production' && !process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await prisma.product.findMany({
      where: {
        deletedAt: null,
        category: {
          slug: { equals: slug, mode: 'insensitive' },
        },

        ...(metalSlug && {
          metal: {
            slug: { equals: metalSlug, mode: 'insensitive' },
          },
        }),
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        metal: true,
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export async function getCategoriesWithMetals() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { deletedAt: null },
        include: {
          metal: true,
          images: true,
        },
      },
    },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    imageUrl: cat.imageUrl,
    products: cat.products,
    metals: Array.from(
      new Map(
        cat.products.filter((p) => p.metal).map((p) => [p.metal!.id, p.metal!])
      ).values()
    ),
  }));
}
