export function ProductCardSkeleton() {
  return (
    <div className="flex w-full">
      <div className="relative flex w-full flex-col overflow-hidden rounded-sm border border-neutral-100 bg-white">
        <div className="relative aspect-[3/4] w-full animate-pulse bg-neutral-100">
          <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-neutral-200/50" />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex-1 space-y-3">
            <div className="h-5 w-5/6 animate-pulse rounded bg-neutral-200" />

            <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-100" />
          </div>

          <div className="mt-6 h-[44px] w-full animate-pulse rounded-sm bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
