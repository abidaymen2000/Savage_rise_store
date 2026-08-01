"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, Search, SlidersHorizontal, X } from "lucide-react"
import ProductCard from "@/components/storefront/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { api } from "@/lib/api"
import { getStorefrontContent } from "@/lib/storefront/content"
import { productMatchesCategoryFeature } from "@/lib/storefront/catalog"
import { getAvailableColors, getAvailableSizes, sortProductsByStockStatus } from "@/lib/utils"
import { SHOP_PRODUCT_KIND, isShopProduct } from "@/lib/product-kind"
import { trackMetaPixelEvent } from "@/lib/meta-pixel"
import { trackStoreEvent } from "@/lib/store-analytics"
import type { Product } from "@/types/api"

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="space-y-3">
          <div className="aspect-[3/4] animate-pulse bg-stone-900" />
          <div className="h-4 w-3/4 animate-pulse bg-stone-900" />
          <div className="h-4 w-1/3 animate-pulse bg-stone-900" />
        </div>
      ))}
    </div>
  )
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const content = getStorefrontContent()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [color, setColor] = useState(searchParams.get("color") || "all")
  const [size, setSize] = useState(searchParams.get("size") || "all")
  const [availability, setAvailability] = useState(searchParams.get("availability") || "all")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const productsData = await api.getProducts(0, 80, { productKind: SHOP_PRODUCT_KIND })
      setProducts(productsData.filter(isShopProduct))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les produits.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set("q", searchTerm.trim())
    if (category !== "all") params.set("category", category)
    if (color !== "all") params.set("color", color)
    if (size !== "all") params.set("size", size)
    if (availability !== "all") params.set("availability", availability)
    if (sortBy !== "newest") params.set("sort", sortBy)
    router.replace(`/products${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false })
  }, [availability, category, color, router, searchTerm, size, sortBy])

  useEffect(() => {
    trackStoreEvent("collection_viewed", {
      metadata: { collection: "products", category, color, size, availability, sort: sortBy },
    })
  }, [availability, category, color, size, sortBy])

  const categoryOptions = content.categoryFeatures.filter((feature) => feature.key !== "packs")
  const colorOptions = useMemo(() => Array.from(new Set(products.flatMap(getAvailableColors))).filter(Boolean).sort(), [products])
  const sizeOptions = useMemo(() => Array.from(new Set(products.flatMap((product) => getAvailableSizes(product)))).filter(Boolean).sort(), [products])

  const filteredProducts = useMemo(() => {
    const activeCategory = categoryOptions.find((feature) => feature.key === category)
    const query = searchTerm.trim().toLowerCase()
    const filtered = products.filter((product) => {
      if (query && ![product.name, product.full_name, product.description].filter(Boolean).join(" ").toLowerCase().includes(query)) return false
      if (activeCategory && !productMatchesCategoryFeature(product, activeCategory)) return false
      if (color !== "all" && !getAvailableColors(product).some((item) => item.toLowerCase() === color.toLowerCase())) return false
      if (size !== "all" && !getAvailableSizes(product).some((item) => item.toLowerCase() === size.toLowerCase())) return false
      if (availability === "available" && !product.in_stock) return false
      if (availability === "sold-out" && product.in_stock) return false
      return true
    })

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })
    return sortProductsByStockStatus(sorted)
  }, [availability, category, categoryOptions, color, products, searchTerm, size, sortBy])

  useEffect(() => {
    const query = searchTerm.trim()
    if (query.length < 2) return
    const timeout = window.setTimeout(() => {
      trackMetaPixelEvent("Search", { search_string: query, content_type: "product" })
      trackStoreEvent("search_submitted", { metadata: { query, result_count: filteredProducts.length } })
    }, 700)
    return () => window.clearTimeout(timeout)
  }, [filteredProducts.length, searchTerm])

  const activeFilterCount = [category, color, size, availability].filter((value) => value !== "all").length
  const resetFilters = () => {
    setCategory("all")
    setColor("all")
    setSize("all")
    setAvailability("all")
    setSearchTerm("")
  }

  const filters = (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Categorie</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="rounded-none border-stone-700 bg-black text-white"><SelectValue /></SelectTrigger>
          <SelectContent className="border-stone-700 bg-black text-white">
            <SelectItem value="all">Toutes</SelectItem>
            {categoryOptions.map((feature) => <SelectItem key={feature.key} value={feature.key}>{feature.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Couleur</label>
        <Select value={color} onValueChange={setColor}>
          <SelectTrigger className="rounded-none border-stone-700 bg-black text-white"><SelectValue /></SelectTrigger>
          <SelectContent className="border-stone-700 bg-black text-white">
            <SelectItem value="all">Toutes</SelectItem>
            {colorOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Taille</label>
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger className="rounded-none border-stone-700 bg-black text-white"><SelectValue /></SelectTrigger>
          <SelectContent className="border-stone-700 bg-black text-white">
            <SelectItem value="all">Toutes</SelectItem>
            {sizeOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Disponibilite</label>
        <Select value={availability} onValueChange={setAvailability}>
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

  return (
    <main className="min-h-screen bg-[#050504] px-4 pb-16 pt-32 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-stone-800 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Savage Rise</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-playfair text-5xl leading-none sm:text-6xl">Boutique</h1>
              <p className="mt-3 text-sm text-stone-400">{loading ? "Chargement du catalogue..." : `${filteredProducts.length} produit${filteredProducts.length > 1 ? "s" : ""}`}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Rechercher"
                  className="h-11 rounded-none border-stone-700 bg-black pl-10 text-white placeholder:text-stone-500 sm:w-72"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 rounded-none border-stone-700 bg-black text-white sm:w-52">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
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
                    Filtrer {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto border-stone-800 bg-[#050504] text-white">
                  <SheetHeader>
                    <SheetTitle className="text-white">Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">{filters}</div>
                  <Button className="mt-4 w-full rounded-none bg-white text-black hover:bg-[#D4AF37]" onClick={() => setFiltersOpen(false)}>
                    Appliquer
                  </Button>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <div className="grid gap-8 py-8 lg:grid-cols-[16rem_1fr]">
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
              {filters}
            </div>
          </aside>

          <section>
            {loading ? (
              <CatalogSkeleton />
            ) : error ? (
              <div className="border border-red-900/50 bg-red-950/20 p-8 text-center">
                <p className="text-red-200">{error}</p>
                <Button onClick={fetchProducts} className="mt-5 rounded-none bg-white text-black hover:bg-[#D4AF37]">Reessayer</Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="border border-stone-800 p-10 text-center">
                <p className="text-lg font-semibold text-white">Aucun produit trouve.</p>
                <p className="mt-2 text-sm text-stone-400">Essaie une autre taille, couleur ou categorie.</p>
                <Button onClick={resetFilters} className="mt-5 rounded-none bg-white text-black hover:bg-[#D4AF37]">Voir toute la boutique</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
