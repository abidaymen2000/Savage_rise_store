"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Filter, Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { trackMetaPixelEvent } from "@/lib/meta-pixel"
import { trackStoreEvent } from "@/lib/store-analytics"

export type ProductsFilterState = {
  q: string
  category: string
  color: string
  size: string
  availability: string
  sort: string
  page: number
}

type Option = {
  value: string
  label: string
}

type ProductsControlsProps = {
  filters: ProductsFilterState
  categoryOptions: Option[]
  colorOptions: string[]
  sizeOptions: string[]
  resultCount: number
  variant?: "toolbar" | "aside"
}

function buildParams(filters: ProductsFilterState, overrides: Partial<ProductsFilterState> = {}) {
  const next = { ...filters, ...overrides }
  const params = new URLSearchParams()
  if (next.q.trim()) params.set("q", next.q.trim())
  if (next.category !== "all") params.set("category", next.category)
  if (next.color !== "all") params.set("color", next.color)
  if (next.size !== "all") params.set("size", next.size)
  if (next.availability !== "all") params.set("availability", next.availability)
  if (next.sort !== "newest") params.set("sort", next.sort)
  if (next.page > 1) params.set("page", String(next.page))
  return params
}

export default function ProductsControls({ filters, categoryOptions, colorOptions, sizeOptions, resultCount, variant = "toolbar" }: ProductsControlsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState(filters.q)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setQuery(filters.q)
  }, [filters.q])

  const activeFilterCount = [filters.category, filters.color, filters.size, filters.availability].filter((value) => value !== "all").length

  const replaceFilters = useCallback((overrides: Partial<ProductsFilterState>) => {
    const params = buildParams(filters, { ...overrides, page: overrides.page ?? 1 })
    startTransition(() => {
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false })
    })
  }, [filters, pathname, router, startTransition])

  const resetFilters = useCallback(() => {
    setQuery("")
    replaceFilters({ q: "", category: "all", color: "all", size: "all", availability: "all", sort: "newest", page: 1 })
    setFiltersOpen(false)
  }, [replaceFilters])

  useEffect(() => {
    if (variant !== "toolbar") return
    const timeout = window.setTimeout(() => {
      if (query === filters.q) return
      replaceFilters({ q: query })
    }, 350)
    return () => window.clearTimeout(timeout)
  }, [filters.q, query, replaceFilters, variant])

  useEffect(() => {
    if (variant !== "toolbar") return
    trackStoreEvent("collection_viewed", {
      metadata: {
        collection: "products",
        category: filters.category,
        color: filters.color,
        size: filters.size,
        availability: filters.availability,
        sort: filters.sort,
      },
    })
  }, [filters.availability, filters.category, filters.color, filters.size, filters.sort, variant])

  useEffect(() => {
    if (variant !== "toolbar") return
    const search = filters.q.trim()
    if (search.length < 2) return
    trackMetaPixelEvent("Search", { search_string: search, content_type: "product" })
    trackStoreEvent("search_submitted", { metadata: { query: search, result_count: resultCount } })
  }, [filters.q, resultCount, variant])

  const filterFields = (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Categorie</label>
        <Select value={filters.category} onValueChange={(value) => replaceFilters({ category: value })}>
          <SelectTrigger className="rounded-none border-stone-700 bg-black text-white"><SelectValue /></SelectTrigger>
          <SelectContent className="border-stone-700 bg-black text-white">
            <SelectItem value="all">Toutes</SelectItem>
            {categoryOptions.map((feature) => <SelectItem key={feature.value} value={feature.value}>{feature.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Couleur</label>
        <Select value={filters.color} onValueChange={(value) => replaceFilters({ color: value })}>
          <SelectTrigger className="rounded-none border-stone-700 bg-black text-white"><SelectValue /></SelectTrigger>
          <SelectContent className="border-stone-700 bg-black text-white">
            <SelectItem value="all">Toutes</SelectItem>
            {colorOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Taille</label>
        <Select value={filters.size} onValueChange={(value) => replaceFilters({ size: value })}>
          <SelectTrigger className="rounded-none border-stone-700 bg-black text-white"><SelectValue /></SelectTrigger>
          <SelectContent className="border-stone-700 bg-black text-white">
            <SelectItem value="all">Toutes</SelectItem>
            {sizeOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Disponibilite</label>
        <Select value={filters.availability} onValueChange={(value) => replaceFilters({ availability: value })}>
          <SelectTrigger className="rounded-none border-stone-700 bg-black text-white"><SelectValue /></SelectTrigger>
          <SelectContent className="border-stone-700 bg-black text-white">
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="sold-out">Epuise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="button" variant="outline" className="w-full rounded-none border-stone-700 bg-transparent text-white hover:bg-white hover:text-black" onClick={resetFilters}>
        Reinitialiser
      </Button>
    </div>
  )

  if (variant === "aside") {
    return (
      <aside className="hidden lg:block">
        <div className="sticky top-32 border border-stone-800 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Filtres</h2>
            {activeFilterCount > 0 && (
              <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-white">
                <X className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
          {filterFields}
        </div>
      </aside>
    )
  }

  return (
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher"
            className="h-11 w-full rounded-none border-stone-700 bg-black pl-10 text-white placeholder:text-stone-500 sm:w-72"
          />
        </div>
        <Select value={filters.sort} onValueChange={(value) => replaceFilters({ sort: value })}>
          <SelectTrigger className="h-11 w-full rounded-none border-stone-700 bg-black text-white sm:w-52">
            <SlidersHorizontal className="mr-2 h-4 w-4 shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-stone-700 bg-black text-white">
            <SelectItem value="newest">Nouveautes</SelectItem>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix decroissant</SelectItem>
            <SelectItem value="name">Nom A-Z</SelectItem>
          </SelectContent>
        </Select>
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-11 rounded-none border-stone-700 bg-transparent text-white hover:bg-white hover:text-black lg:hidden">
              <Filter className="mr-2 h-4 w-4" />
              Filtres {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto border-stone-800 bg-[#050504] text-white">
            <SheetHeader>
              <SheetTitle className="text-white">Filtres</SheetTitle>
            </SheetHeader>
            <div className="mt-6">{filterFields}</div>
            <Button className="mt-4 w-full rounded-none bg-white text-black hover:bg-[#D4AF37]" onClick={() => setFiltersOpen(false)}>
              Appliquer
            </Button>
          </SheetContent>
        </Sheet>
      </div>
  )
}
