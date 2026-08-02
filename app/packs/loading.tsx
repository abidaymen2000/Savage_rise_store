export default function Loading() {
  return (
    <main className="min-h-screen bg-background pt-24 text-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10 max-w-3xl">
          <div className="h-4 w-44 animate-pulse bg-stone-800" />
          <div className="mt-4 h-16 w-full max-w-2xl animate-pulse bg-stone-900" />
          <div className="mt-4 h-5 w-full max-w-xl animate-pulse bg-stone-900" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="grid overflow-hidden rounded-2xl border border-accent/20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="min-h-[260px] animate-pulse bg-stone-900" />
              <div className="space-y-4 p-6">
                <div className="h-3 w-28 animate-pulse bg-stone-800" />
                <div className="h-8 w-2/3 animate-pulse bg-stone-900" />
                <div className="h-4 w-full animate-pulse bg-stone-900" />
                <div className="h-4 w-4/5 animate-pulse bg-stone-900" />
                <div className="h-10 w-36 animate-pulse bg-stone-900" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

