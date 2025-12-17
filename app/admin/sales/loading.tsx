export default function SalesLoading() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-64 animate-pulse rounded bg-muted" />
          <div className="h-10 w-40 animate-pulse rounded bg-muted" />
        </div>

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-12 w-12 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
            <div className="mb-4 space-y-2">
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-[300px] animate-pulse rounded bg-muted" />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 space-y-2">
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-[200px] animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 space-y-2">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-[250px] animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}
