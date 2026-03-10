export function HeadCategorySkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="mb-12 space-y-2">
        <div className="h-10 w-64 animate-pulse rounded bg-neutral-200" />
        <div className="h-6 w-80 animate-pulse rounded bg-neutral-100" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-5">
            <div className="aspect-[4/5] w-full animate-pulse rounded-sm bg-neutral-200" />
            <div className="flex items-center justify-between">
              <div className="h-6 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
