export function OrderPageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-12 md:py-20">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-neutral-200" />
        <div className="mx-auto h-8 w-64 rounded bg-neutral-200" />
        <div className="mx-auto mt-3 h-4 w-80 rounded bg-neutral-100" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="h-48 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm" />

          <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm">
            <div className="h-14 border-b border-neutral-100 bg-neutral-50/50" />
            <div className="space-y-6 p-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-40 rounded bg-neutral-200" />
                    <div className="h-3 w-20 rounded bg-neutral-100" />
                  </div>
                  <div className="h-5 w-24 rounded bg-neutral-200" />
                </div>
              ))}
            </div>
            <div className="h-20 border-t border-neutral-100 bg-neutral-50/50" />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="mb-6 h-4 w-32 rounded bg-neutral-200" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-4 w-4 rounded bg-neutral-100" />
                  <div className="h-4 w-full rounded bg-neutral-100" />
                </div>
              ))}
            </div>
          </div>
          <div className="h-12 w-full rounded-xl bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
