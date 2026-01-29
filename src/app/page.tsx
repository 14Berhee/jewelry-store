import Hero from '../components/Hero';
import Bar from '../components/Bar';
import HeadCategory from '../components/HeadCategory';
import { prisma } from '@/lib/prisma';
import ProductGrid from '../components/productCards/ProductGrid';

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: {
          deletedAt: null,
        },
      },
    },
  });
  const products = await prisma.product.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      metal: true,
      category: true,
    },
  });

  return (
    <main className="bg-white bg-gradient-to-br from-amber-50 via-white to-rose-50 text-neutral-900">
      <Hero />
      <Bar />
      <HeadCategory category={categories} />
      <ProductGrid products={products} />
    </main>
  );
}
