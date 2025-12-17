export default function CategoriesLoading() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
        <div className="h-6 w-28 animate-pulse rounded bg-muted" />
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 animate-pulse rounded bg-muted" />
          <div className="h-10 w-36 animate-pulse rounded bg-muted" />
        </div>

        <div className="flex items-center justify-between">
          <div className="h-10 w-64 animate-pulse rounded bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex gap-8">
              {["Category", "Description", "Products", "Status", "Created", ""].map((_, i) => (
                <div key={i} className="h-4 w-20 animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
          <div className="divide-y divide-border">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <div className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                <div className="h-4 w-8 animate-pulse rounded bg-muted" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="flex gap-1 ml-auto">
                  <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
