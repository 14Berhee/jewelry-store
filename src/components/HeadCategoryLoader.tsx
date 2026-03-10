import { prisma } from '@/lib/prisma';
import HeadCategory from './HeadCategory';

export default async function HeadCategoryLoader() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
    },
  });

  return <HeadCategory categories={categories} />;
}
