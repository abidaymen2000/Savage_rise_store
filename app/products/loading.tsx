export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050504] px-4 pb-16 pt-28 text-white sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-stone-800 pb-8">
          <div className="h-3 w-28 animate-pulse bg-stone-800" />
          <div className="mt-4 h-14 w-48 animate-pulse bg-stone-900" />
          <div className="mt-4 h-4 w-24 animate-pulse bg-stone-900" />
        </div>
        <div className="grid gap-8 py-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="hidden space-y-4 border border-stone-800 p-4 lg:block">
            {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-11 animate-pulse bg-stone-900" />)}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-3 min-[390px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="border border-stone-800 bg-[#080807] p-3">
                <div className="aspect-[3/4] animate-pulse bg-stone-900" />
                <div className="mt-4 h-4 w-3/4 animate-pulse bg-stone-900" />
                <div className="mt-3 h-4 w-1/3 animate-pulse bg-stone-900" />
                <div className="mt-4 grid grid-cols-[minmax(0,1fr)_44px_44px] gap-2">
                  <div className="h-11 animate-pulse bg-stone-900" />
                  <div className="h-11 animate-pulse bg-stone-900" />
                  <div className="h-11 animate-pulse bg-stone-900" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
