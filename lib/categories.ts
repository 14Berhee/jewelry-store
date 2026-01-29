import { prisma } from './prisma';

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
