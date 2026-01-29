import { ProductGridSkeleton } from '@/src/components/skeletons/ProductGridSkeleton';

export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Title skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      </div>

      <ProductGridSkeleton />
    </section>
  );
}
