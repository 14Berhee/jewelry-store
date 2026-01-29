import { Skeleton } from './Skeleton';

export function HeroSkeleton() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-96 rounded-lg" />
          <Skeleton className="mx-auto h-6 w-64 rounded" />
          <Skeleton className="mx-auto mt-6 h-12 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
