'use client';

export default function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 lg:h-16 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-pulse rounded bg-gray-200 md:hidden" />

          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="hidden gap-8 md:flex">
          <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </header>
  );
}
