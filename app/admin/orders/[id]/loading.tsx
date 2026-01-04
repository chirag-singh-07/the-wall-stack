export default function OrderDetailsLoading() {
  return (
    <div className="min-h-screen">
      <div className="h-24 w-full animate-pulse bg-muted/20" />
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-6 h-10 w-32 animate-pulse rounded bg-muted/30" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[400px] w-full animate-pulse rounded-xl bg-muted/20" />
            <div className="h-[200px] w-full animate-pulse rounded-xl bg-muted/20" />
          </div>
          <div className="space-y-6">
            <div className="h-[150px] w-full animate-pulse rounded-xl bg-muted/20" />
            <div className="h-[150px] w-full animate-pulse rounded-xl bg-muted/20" />
            <div className="h-[150px] w-full animate-pulse rounded-xl bg-muted/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
