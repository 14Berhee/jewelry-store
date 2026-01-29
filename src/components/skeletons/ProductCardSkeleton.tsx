import { Skeleton } from './Skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      {/* Image */}
      <Skeleton className="aspect-square w-full rounded-lg" />

      {/* Content */}
      <div className="mt-3 space-y-2">
        {/* Title */}
        <Skeleton className="h-4 w-3/4 rounded" />

        {/* Price */}
        <Skeleton className="h-5 w-1/2 rounded" />

        {/* Rating */}
        <div className="flex gap-1">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-3 rounded-full" />
        </div>
      </div>
    </div>
  );
}
