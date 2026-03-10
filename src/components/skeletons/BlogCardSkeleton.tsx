export function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="mb-6 h-10 w-3/4 animate-pulse rounded-lg bg-gray-200 sm:h-12" />

          <div className="flex gap-4">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
          </div>
        </header>

        <div className="relative mb-10 aspect-[2/1] w-full animate-pulse rounded-2xl bg-gray-200 shadow-lg" />

        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200 pt-8" />{' '}
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </article>
    </div>
  );
}
