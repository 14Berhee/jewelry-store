import { Skeleton } from '@/src/components/skeletons/Skeleton';

export function BlogListSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <Skeleton className="mx-auto mb-4 h-10 w-64 rounded-lg" />
        <Skeleton className="mx-auto h-5 w-96 rounded" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <article
            key={i}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <Skeleton className="aspect-[16/10] w-full" />

            <div className="flex flex-1 flex-col space-y-4 p-6">
              <Skeleton className="h-6 w-3/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />

              <div className="mt-auto flex items-center justify-between pt-4">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
