import { catalogOptionDisplay } from "@/lib/catalog-option-display"
import { catalogCardDetail } from "@/lib/catalog-card-detail"
import { CatalogIntegrityError, readCatalog, validateCatalogPage, type CatalogObserver } from "@/lib/catalog-read"
import { availabilityStatus } from "@/lib/availability"
import {
  CatalogService,
  type BundleComponent,
  type CategoryRead,
  type PaginatedResponse_ProductListItem_,
  type ProductListItem,
  type ProductKind,
  type ProductStorefrontDetail,
  type ProductVariantRead,
} from "./api-client"
import { ApiError } from "./api-error"
import type { Category, Pack, PackComponent, PackProductSummary, Product, ProductImage, SearchFilters, SizeStock, Variant } from "@/types/api"

export type CatalogProductPage = {
  items: Product[]
  total: number
  page: number
  page_size: number
  pages: number
  has_next?: boolean
  has_prev?: boolean
}

export type CatalogProductQuery = {
  q?: string | null
  productKind?: ProductKind | null
  categoryId?: string | null
}

function toNumber(value: unknown, fallback = 0) {
  const number = typeof value === "number" ? value : Number(value)
  return Number.isFinite(number) ? number : fallback
}

function titleCase(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

function mediaToImages(media: ProductStorefrontDetail["media"] | ProductVariantRead["media"]): ProductImage[] {
  return [...(media ?? [])]
    .sort((a, b) => Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary)) || (a.position ?? 0) - (b.position ?? 0))
    .map((item, index) => ({
      id: item.asset_id ?? item.provider_file_id ?? `${item.url}-${index}`,
      url: item.url,
      alt_text: item.alt_text ?? null,
      order: item.position ?? index,
      is_primary: item.is_primary ?? null,
    }))
}

function optionEntries(variant: ProductVariantRead) {
  return Object.entries(variant.option_values ?? {})
}

function isDefaultOption(value: string | undefined) {
  const normalized = value?.toLowerCase().trim()
  return !normalized || normalized === "default" || normalized === "__default__"
}

function hasDisplayableOptionValues(variant: ProductVariantRead) {
  const entries = optionEntries(variant)
  return entries.length > 0 && entries.some(([key, value]) => !isDefaultOption(key) && !isDefaultOption(value))
}

function legacySizeInStock(size: SizeStock) {
  return availabilityStatus(size) === "available"
}

function variantToLegacy(variant: ProductVariantRead, productPrice: number, productKind?: string, axes?: ProductStorefrontDetail["option_axes"]): Variant {
  const display = catalogOptionDisplay(variant, axes)
  const entries = Object.entries(display.labels)
  const bundleWithoutOptions = productKind === "bundle" && !hasDisplayableOptionValues(variant)
  const colorEntry = entries.find(([axis]) => ["color", "colour", "couleur"].includes(axis.normalize("NFKC").trim().toLowerCase()))
  const sizeEntry = entries.find(([axis]) => ["size", "taille"].includes(axis.normalize("NFKC").trim().toLowerCase()))
  const first = bundleWithoutOptions ? "" : display.color?.label ?? colorEntry?.[1] ?? entries[0]?.[1] ?? variant.title
  const second = bundleWithoutOptions ? "" : display.size ?? sizeEntry?.[1] ?? entries[1]?.[1] ?? "default"
  const inventory = variant.inventory ?? null
  const trackInventory = inventory?.track_inventory ?? variant.track_inventory ?? true
  const stockOnHand = inventory?.stock_on_hand
  const stockReserved = inventory?.stock_reserved
  const stockAvailable = inventory?.stock_available ?? (typeof stockOnHand === "number" && typeof stockReserved === "number" ? Math.max(stockOnHand - stockReserved, 0) : undefined)
  const inStock = inventory?.in_stock
  const size: SizeStock | null = bundleWithoutOptions ? null : {
    size: second,
    track_inventory: trackInventory,
    stock_on_hand: stockOnHand,
    stock_reserved: stockReserved,
    stock_available: stockAvailable,
    stock: trackInventory ? stockAvailable : undefined,
    in_stock: inStock,
    availability_status: inventory?.availability_status,
    low_stock: inventory?.low_stock,
    sku: variant.sku ?? null,
    status: variant.status ?? null,
    variant_item_id: variant.id,
    meta_content_id: variant.id,
  }
  const variantPrice = toNumber(variant.effective_price ?? variant.base_price, productPrice)
  const compareAtPrice = toNumber(variant.compare_at_price, 0) || null

  return {
    id: variant.id,
    position: variant.position,
    name: variant.title,
    color: first,
    color_value: display.color?.value,
    option_value_labels: display.labels,
    color_code: display.color?.swatch || (typeof variant.attribute_values?.color_code === "string" ? variant.attribute_values.color_code : null),
    status: variant.status ?? null,
    sizes: size ? [size] : [],
    items: [{
      id: variant.id,
      variant_id: variant.id,
      sku: variant.sku ?? null,
      size: second,
      track_inventory: trackInventory,
      price: variantPrice,
      stock_available: stockAvailable,
      stock_on_hand: stockOnHand,
      stock_reserved: stockReserved,
      in_stock: inStock,
    availability_status: inventory?.availability_status,
    low_stock: inventory?.low_stock,
      status: variant.status ?? null,
    }],
    images: mediaToImages(variant.media),
    meta_content_id: variant.id,
    option_values: variant.option_values ?? {},
    inventory: inventory ? {
      track_inventory: trackInventory,
      stock_on_hand: stockOnHand,
      stock_reserved: stockReserved,
      stock_available: stockAvailable,
      in_stock: inStock,
    availability_status: inventory?.availability_status,
    low_stock: inventory?.low_stock,
    } : null,
    sku: variant.sku ?? null,
    price: variantPrice,
    compare_at_price: compareAtPrice,
  } as Variant
}

function detailToProduct(detail: ProductStorefrontDetail): Product {
  const productMedia = mediaToImages(detail.media)
  const firstVariant = detail.variants?.[0]
  const price = toNumber(firstVariant?.base_price, toNumber(detail.attribute_values?.price))
  const compareAtPrice = toNumber(firstVariant?.compare_at_price, 0) || null
  const variants = (detail.variants ?? []).map(variant => variantToLegacy(variant, price, detail.product_kind, detail.option_axes))
  const images = productMedia.length > 0 ? productMedia : variants.flatMap((variant) => variant.images)
  const inStock = detail.in_stock

  return {
    id: detail.id,
    style_id: detail.slug,
    name: detail.name,
    full_name: detail.name,
    sku: firstVariant?.sku ?? null,
    description: detail.description ?? null,
    categories: detail.category_ids ?? [],
    primary_category_id: detail.primary_category_id ?? null,
    category_ids: detail.category_ids ?? [],
    price,
    compare_at_price: compareAtPrice,
    in_stock: inStock,
    availability_status: detail.availability_status,
    low_stock: detail.low_stock,
    forced_sold_out: detail.forced_sold_out,
    status: detail.status,
    variants,
    images,
    slug: detail.slug,
    product_kind: detail.product_kind,
    option_axes: Array.from(new Set((detail.variants ?? []).filter(hasDisplayableOptionValues).flatMap((variant) => Object.keys(variant.option_values ?? {})))),
    option_values: detail.variants?.filter(hasDisplayableOptionValues).map((variant) => variant.option_values ?? {}) ?? [],
    media: detail.media ?? [],
    bundle_definition: detail.bundle_definition ?? null,
  } as Product
}

async function enrichProducts(items: ProductListItem[], read: (slug: string, item: ProductListItem) => Promise<Product>, observer?: CatalogObserver): Promise<Product[]> {
  const results = await Promise.allSettled(items.map(async (item) => {
    try {
      const product = await read(item.slug, item)
      // A malformed/stale detail must not be silently removed by the Shop filters.
      if (product.id !== item.id || !product.product_kind || product.product_kind !== item.product_kind) throw new CatalogIntegrityError("detail_identity_mismatch")
      return product
    } catch (error) {
      observer?.({ operation: "integrity", reason: error instanceof CatalogIntegrityError ? error.reason : "detail_unavailable", missingIds: [item.id] })
      throw error
    }
  }))
  const failed = results.find((result) => result.status === "rejected")
  if (failed?.status === "rejected") throw failed.reason
  return results.map((result) => (result as PromiseFulfilledResult<Product>).value)
}

function categoryToLegacy(category: CategoryRead): Category {
  return {
    id: category.id,
    name: category.name,
    description: category.description ?? null,
    created_at: category.created_at ?? "",
    updated_at: category.updated_at ?? "",
    slug: category.slug,
    parent_id: category.parent_id ?? null,
    path: category.path ?? null,
    status: category.status ?? null,
    image: category.image ?? null,
  } as Category
}

function bundleComponentToPackComponent(component: BundleComponent, products: Product[]): PackComponent {
  const product = products.find((item) => item.id === component.product_id)
  const fixedVariant = product?.variants.find((variant) => variant.id === component.fixed_variant_id)
  const summary: PackProductSummary = {
    id: component.product_id,
    name: product?.name ?? component.product_id,
    full_name: product?.full_name ?? product?.name ?? component.product_id,
    price: product?.price ?? 0,
    image_url: product?.images?.[0]?.url ?? fixedVariant?.images?.[0]?.url ?? null,
    in_stock: product?.in_stock,
    availability_status: product?.availability_status,
  }

  return {
    id: component.component_id,
    product_id: component.product_id,
    variant_id: component.fixed_variant_id ?? fixedVariant?.id ?? null,
    variant_item_id: component.fixed_variant_id ?? fixedVariant?.id ?? null,
    sku: fixedVariant?.sku ?? null,
    color: fixedVariant?.color ?? null,
    size: fixedVariant?.sizes?.[0]?.size ?? null,
    qty: component.quantity ?? 1,
    product: summary,
    locked_variant: component.selection_mode === "fixed_variant",
  }
}

function productToPack(product: Product, componentProducts: Product[] = []): Pack {
  const components = (product.bundle_definition?.components ?? []).map((component) => bundleComponentToPackComponent(component, componentProducts))
  const originalPrice = components.reduce((sum, component) => sum + (component.product.price ?? 0) * (component.qty ?? 1), 0)
  const pricing = product.bundle_definition?.pricing_policy
  const fixedPrice = toNumber(pricing?.fixed_price)
  const percentDiscount = toNumber(pricing?.percentage_discount)
  const fixedDiscount = toNumber(pricing?.fixed_discount)
  const packPrice =
    pricing?.pricing_mode === "fixed" && fixedPrice > 0
      ? fixedPrice
      : pricing?.pricing_mode === "percentage_discount"
        ? originalPrice * (1 - percentDiscount / 100)
        : pricing?.pricing_mode === "fixed_discount"
          ? Math.max(0, originalPrice - fixedDiscount)
          : product.price || originalPrice
  const compareAtPrice = product.compare_at_price && product.compare_at_price > packPrice
    ? product.compare_at_price
    : originalPrice > packPrice
      ? originalPrice
      : null
  const savingsValue = compareAtPrice && compareAtPrice > packPrice ? compareAtPrice - packPrice : 0
  return {
    id: product.id,
    title: product.name,
    variant_id: product.variants?.[0]?.id ?? null,
    in_stock: product.in_stock,
    availability_status: product.availability_status,
    forced_sold_out: product.forced_sold_out,
    low_stock: product.low_stock,
    description: product.description ?? null,
    product_ids: components.map((component) => component.product_id),
    components,
    products: components.map((component) => component.product),
    discount_type: "fixed_amount",
    discount_value: savingsValue,
    status: "active",
    image_url: product.images?.[0]?.url ?? null,
    order: 0,
    original_price: compareAtPrice ?? packPrice,
    pack_price: packPrice,
    savings_value: savingsValue,
    compare_at_price: compareAtPrice,
    created_at: "",
    updated_at: "",
    product_kind: "bundle",
    bundle_definition: product.bundle_definition,
  } as Pack
}

export const catalogApi = {
  async getProductsPage(skip = 0, limit = 10, query: CatalogProductQuery = {}, observer?: CatalogObserver, cards = false): Promise<CatalogProductPage> {
    const page = Math.floor(skip / limit) + 1
    const response: PaginatedResponse_ProductListItem_ = await readCatalog(
      () => CatalogService.listProductsCatalogProductsGet({
        page,
        pageSize: limit,
        q: query.q,
        productKind: query.productKind,
        categoryId: query.categoryId,
        include: cards ? ["variant_summary"] : undefined,
      }),
      { operation: "products", observer, validate: (value) => {
        observer?.({ operation: "listing", page: value?.page, total: value?.total, loaded: value?.items?.length ?? 0 })
        validateCatalogPage(value, page)
        if (cards) value.items!.forEach(catalogCardDetail)
      } },
    )
    const details = await enrichProducts(response.items!, (slug, item) => {
      const compact = cards ? catalogCardDetail(item) : null
      return compact ? Promise.resolve(detailToProduct(compact)) : this.getProduct(slug, observer)
    }, observer)
    return {
      items: details,
      total: response.total,
      page: response.page,
      page_size: response.page_size,
      pages: response.pages,
      has_next: response.has_next,
      has_prev: response.has_prev,
    }
  },

  async getProductCardsPage(skip = 0, limit = 10, query: CatalogProductQuery = {}, observer?: CatalogObserver): Promise<CatalogProductPage> {
    return this.getProductsPage(skip, limit, query, observer, true)
  },

  async getProducts(skip = 0, limit = 10, query: CatalogProductQuery = {}): Promise<Product[]> {
    return (await this.getProductsPage(skip, limit, query)).items
  },

  async getProduct(slugOrId: string, observer?: CatalogObserver): Promise<Product> {
    const readDetail = (slug: string) => readCatalog(() => CatalogService.getProductCatalogProductsSlugGet({ slug }), {
      operation: "detail", observer,
      validate: (detail) => {
        if (!detail?.id || !detail.slug || !detail.name) throw new CatalogIntegrityError("invalid_product_detail")
        const price = detail.variants?.[0]?.base_price ?? detail.attribute_values?.price
        if (detail.product_kind === "physical" && (price === undefined || price === null || price === "" || !Number.isFinite(Number(price)))) throw new CatalogIntegrityError("missing_product_price")
      },
    })
    try {
      return detailToProduct(await readDetail(slugOrId))
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 404 || !/^[a-f0-9]{24}$/i.test(slugOrId)) throw error
      const response = await readCatalog(() => CatalogService.listProductsCatalogProductsGet({ page: 1, pageSize: 100 }))
      const item = (response.items ?? []).find((product) => product.id === slugOrId || product.slug === slugOrId)
      if (!item) throw error
      return detailToProduct(await readDetail(item.slug))
    }
  },

  async searchProducts(filters: SearchFilters, skip = 0, limit = 10): Promise<Product[]> {
    return (await this.getProductsPage(skip, limit, {
      q: filters.text,
      productKind: filters.sort === "packs" ? "bundle" : undefined,
    })).items
  },

  async getCategories(observer?: CatalogObserver): Promise<Category[]> {
    return (await readCatalog(() => CatalogService.listCategoriesCatalogCategoriesGet(), {
      operation: "categories", observer,
      validate: (categories) => {
        if (!Array.isArray(categories) || categories.some((category) => !category?.id || !category.name) || new Set(categories.map((category) => category.id)).size !== categories.length) throw new CatalogIntegrityError("invalid_categories")
      },
    })).map(categoryToLegacy)
  },

  async getCategory(categoryId: string): Promise<Category> {
    const categories = await this.getCategories()
    const category = categories.find((item) => item.id === categoryId || (item as Category & { slug?: string }).slug === categoryId || item.name === categoryId)
    if (!category) throw new Error(`Category not found: ${categoryId}`)
    return category
  },

  async getProductsByCategory(categorySlug: string, skip = 0, limit = 10): Promise<Product[]> {
    const page = Math.floor(skip / limit) + 1
    const response = await readCatalog(() => CatalogService.productsByCategoryCatalogCategoriesSlugProductsGet({ slug: categorySlug, page, pageSize: limit }))
    validateCatalogPage(response, page)
    return enrichProducts(response.items!, (slug) => this.getProduct(slug))
  },

  async getPacks(skip = 0, limit = 20): Promise<Pack[]> {
    const page = Math.floor(skip / limit) + 1
    const response = await readCatalog(() => CatalogService.listProductsCatalogProductsGet({ page, pageSize: limit, productKind: "bundle" }))
    const products = await Promise.all((response.items ?? []).map((item) => this.getProduct(item.slug)))
    return products.map((product) => productToPack(product, products))
  },

  async getPack(packId: string): Promise<Pack> {
    const product = await this.getProduct(packId)
    const componentProducts = await Promise.all((product.bundle_definition?.components ?? []).map((component) => this.getProduct(component.product_id).catch(() => null)))
    return productToPack(product, componentProducts.filter(Boolean) as Product[])
  },

  formatOptionLabel(axis: string) {
    return titleCase(axis)
  },
}
