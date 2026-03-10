import { prisma } from '@/lib/prisma';
import ProductGrid from './ProductGrid';

export default async function ProductGridContainer() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: {
      images: { orderBy: { order: 'asc' } },
      metal: true,
      category: true,
    },
  });

  return <ProductGrid products={products} />;
}
