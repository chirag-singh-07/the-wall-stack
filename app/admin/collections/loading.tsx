export default function CollectionsLoading() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
        <div className="h-6 w-28 animate-pulse rounded bg-muted" />
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-64 animate-pulse rounded bg-muted" />
          <div className="h-10 w-36 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="aspect-[4/3] animate-pulse bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  <div className="flex gap-1">
                    <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                    <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
