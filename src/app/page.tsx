import { Suspense } from 'react';
import ProductGridContainer from '../components/productCards/ProductGridContainer';
import LumeIntro from '../components/LumeIntro';
import Hero from '../components/Hero';
import Bar from '../components/Bar';
import HeadCategoryLoader from '../components/HeadCategoryLoader';
import { HeadCategorySkeleton } from '../components/skeletons/HeadCategorySkeleton';
import ProductGridSkeleton from '../components/skeletons/ProductGridSkeleton';

export default function HomePage() {
  return (
    <main className="bg-white bg-gradient-to-br ..." suppressHydrationWarning>
      <LumeIntro />
      <Hero />
      <Bar />

      <Suspense fallback={<HeadCategorySkeleton />}>
        <HeadCategoryLoader />
      </Suspense>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGridContainer />
      </Suspense>
    </main>
  );
}
