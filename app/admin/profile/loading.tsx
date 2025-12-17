export default function AdminProfileLoading() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
        <div className="h-6 w-20 animate-pulse rounded bg-muted" />
      </div>

      <div className="p-6 max-w-4xl space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-28 animate-pulse rounded bg-muted" />
          ))}
        </div>

        {/* Profile Card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />
            <div className="space-y-2 text-center sm:text-left">
              <div className="h-6 w-40 animate-pulse rounded bg-muted mx-auto sm:mx-0" />
              <div className="h-4 w-48 animate-pulse rounded bg-muted mx-auto sm:mx-0" />
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-6 space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-56 animate-pulse rounded bg-muted" />
          </div>
          <div className="p-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-10 w-full animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
            <div className="h-10 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Stats Card */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-6 space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-56 animate-pulse rounded bg-muted" />
          </div>
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-5 w-32 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
