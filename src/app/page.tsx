import Hero from '../components/Hero';
import Bar from '../components/Bar';
import HeadCategory from '../components/HeadCategory';
import { prisma } from '@/lib/prisma';
import ProductGrid from '../components/productCards/ProductGrid';

export const revalidate = 60;

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    include: {
      metals: true,
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
      <HeadCategory categories={categories} />
      <ProductGrid products={products} />
    </main>
  );
}
