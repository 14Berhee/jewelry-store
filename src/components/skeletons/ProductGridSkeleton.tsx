// components/skeletons/CategoryGridSkeleton.tsx
import { CategoryCardSkeleton } from './CategoryHeaderSkeleton';

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}
