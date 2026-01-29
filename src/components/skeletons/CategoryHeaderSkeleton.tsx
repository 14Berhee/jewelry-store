// components/skeletons/CategoryCardSkeleton.tsx
import { Skeleton } from '@/src/components/skeletons/Skeleton';

export function CategoryCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white">
      {/* Image */}
      <Skeleton className="aspect-[3/4] w-full rounded-t-2xl" />

      {/* Content */}
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-3/4 rounded" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>

        <Skeleton className="h-11 w-full rounded-lg" />

        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <Skeleton className="absolute top-3 right-3 h-9 w-9 rounded-full" />
    </div>
  );
}
