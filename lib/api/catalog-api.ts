import {
  CatalogService,
  type BundleComponent,
  type CategoryRead,
  type PaginatedResponse_ProductListItem_,
  type ProductKind,
  type ProductStorefrontDetail,
  type ProductVariantRead,
} from "./api-client"
import { ApiError, isResourceNotFound, reportApiFailure, withApiErrors } from "./api-error"
import { catalogPageContract, categoriesContract, productDetailContract, validateApiResponse } from "./response-contracts"
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

function variantDisplayAxis(variant: ProductVariantRead, index: number, fallback: string) {
  return optionEntries(variant)[index]?.[1] ?? fallback
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
  if (size.track_inventory === false) return size.in_stock !== false
  return (size.stock_available ?? size.stock ?? 0) > 0
}

function variantToLegacy(variant: ProductVariantRead, productPrice: number, productKind?: string): Variant {
  const entries = optionEntries(variant)
  const bundleWithoutOptions = productKind === "bundle" && !hasDisplayableOptionValues(variant)
  const first = bundleWithoutOptions ? "" : variant.option_values?.color ?? entries[0]?.[1] ?? variant.title
  const second = bundleWithoutOptions ? "" : variant.option_values?.size ?? entries[1]?.[1] ?? "default"
  const inventory = variant.inventory ?? null
  const trackInventory = inventory?.track_inventory ?? variant.track_inventory ?? true
  const stockOnHand = inventory?.stock_on_hand ?? 0
  const stockReserved = inventory?.stock_reserved ?? 0
  const stockAvailable = trackInventory ? Math.max(toNumber(inventory?.stock_available, stockOnHand - stockReserved), 0) : 0
  const inStock = inventory?.in_stock ?? (trackInventory ? stockAvailable > 0 : variant.status !== "inactive" && variant.status !== "archived")
  const size: SizeStock | null = bundleWithoutOptions ? null : {
    size: second,
    track_inventory: trackInventory,
    stock_on_hand: stockOnHand,
    stock_reserved: stockReserved,
    stock_available: stockAvailable,
    stock: trackInventory ? stockAvailable : undefined,
    in_stock: inStock,
    sku: variant.sku ?? null,
    status: variant.status ?? null,
    variant_item_id: variant.id,
    meta_content_id: variant.id,
  }
  const variantPrice = toNumber(variant.effective_price ?? variant.base_price ?? productPrice, productPrice)
  const compareAtPrice = toNumber(variant.compare_at_price, 0) || null

  return {
    id: variant.id,
    name: variant.title,
    color: first,
    color_code: typeof variant.attribute_values?.color_code === "string" ? variant.attribute_values.color_code : null,
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
    } : null,
    sku: variant.sku ?? null,
    price: variantPrice,
    compare_at_price: compareAtPrice,
  } as Variant
}

function detailToProduct(detail: ProductStorefrontDetail): Product {
  validateApiResponse(detail, productDetailContract, { method: "GET", path: "/catalog/products/{slug}" })
  const productMedia = mediaToImages(detail.media)
  const firstVariant = detail.variants?.[0]
  const rawPrice = firstVariant?.effective_price ?? firstVariant?.base_price ?? detail.bundle_definition?.pricing_policy?.fixed_price ?? detail.attribute_values?.price
  if (rawPrice === null || rawPrice === undefined || !Number.isFinite(Number(rawPrice))) {
    const error = new ApiError(502, { code: "INVALID_API_RESPONSE" }, "Le prix du produit est indisponible. Réessayez plus tard.", { method: "GET", path: "/catalog/products/{slug}" })
    reportApiFailure(error)
    throw error
  }
  const price = Number(rawPrice)
  const compareAtPrice = toNumber(firstVariant?.compare_at_price, 0) || null
  const variants = (detail.variants ?? []).map((variant) => variantToLegacy(variant, price, detail.product_kind))
  const images = productMedia.length > 0 ? productMedia : variants.flatMap((variant) => variant.images)
  const inStock = detail.product_kind === "bundle" ? detail.status === "active" : variants.some((variant) => variant.sizes.some(legacySizeInStock))

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
    in_stock: product?.in_stock ?? true,
  }

  return {
    id: component.component_id,
    product_id: component.product_id,
    variant_id: component.fixed_variant_id ?? fixedVariant?.id ?? null,
    variant_item_id: component.fixed_variant_id ?? fixedVariant?.id ?? null,
    sku: fixedVariant?.sku ?? null,
    color: fixedVariant ? variantDisplayAxis(fixedVariant as unknown as ProductVariantRead, 0, fixedVariant.color) : null,
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
  async getProductsPage(skip = 0, limit = 10, query: CatalogProductQuery = {}): Promise<CatalogProductPage> {
    const page = Math.floor(skip / limit) + 1
    const response: PaginatedResponse_ProductListItem_ = await withApiErrors(
      CatalogService.listProductsCatalogProductsGet({
        page,
        pageSize: limit,
        q: query.q,
        productKind: query.productKind,
        categoryId: query.categoryId,
      }),
      { method: "GET", path: "/catalog/products" },
    )
    validateApiResponse(response, catalogPageContract, { method: "GET", path: "/catalog/products" })
    const details = await Promise.all(response.items!.map((item) => this.getProduct(item.slug)))
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

  async getProducts(skip = 0, limit = 10, query: CatalogProductQuery = {}): Promise<Product[]> {
    return (await this.getProductsPage(skip, limit, query)).items
  },

  async getProduct(slugOrId: string): Promise<Product> {
    try {
      return detailToProduct(await withApiErrors(CatalogService.getProductCatalogProductsSlugGet({ slug: slugOrId }), { method: "GET", path: "/catalog/products/{slug}" }))
    } catch (error) {
      if (!isResourceNotFound(error)) throw error
      const response = await withApiErrors(CatalogService.listProductsCatalogProductsGet({ page: 1, pageSize: 100 }), { method: "GET", path: "/catalog/products" })
      validateApiResponse(response, catalogPageContract, { method: "GET", path: "/catalog/products" })
      const item = response.items!.find((product) => product.id === slugOrId || product.slug === slugOrId)
      if (!item) throw error
      return detailToProduct(await withApiErrors(CatalogService.getProductCatalogProductsSlugGet({ slug: item.slug })))
    }
  },

  async searchProducts(filters: SearchFilters, skip = 0, limit = 10): Promise<Product[]> {
    return (await this.getProductsPage(skip, limit, {
      q: filters.text,
      productKind: filters.sort === "packs" ? "bundle" : undefined,
    })).items
  },

  async getCategories(): Promise<Category[]> {
    const response = await withApiErrors(CatalogService.listCategoriesCatalogCategoriesGet(), { method: "GET", path: "/catalog/categories" })
    return validateApiResponse(response, categoriesContract, { method: "GET", path: "/catalog/categories" }).map(categoryToLegacy)
  },

  async getCategory(categoryId: string): Promise<Category> {
    const categories = await this.getCategories()
    const category = categories.find((item) => item.id === categoryId || (item as Category & { slug?: string }).slug === categoryId || item.name === categoryId)
    if (!category) throw new Error(`Category not found: ${categoryId}`)
    return category
  },

  async getProductsByCategory(categorySlug: string, skip = 0, limit = 10): Promise<Product[]> {
    const page = Math.floor(skip / limit) + 1
    const response = await withApiErrors(CatalogService.productsByCategoryCatalogCategoriesSlugProductsGet({ slug: categorySlug, page, pageSize: limit }))
    validateApiResponse(response, catalogPageContract, { method: "GET", path: "/catalog/categories/{slug}/products" })
    return Promise.all(response.items!.map((item) => this.getProduct(item.slug)))
  },

  async getPacks(skip = 0, limit = 20): Promise<Pack[]> {
    const page = Math.floor(skip / limit) + 1
    const response = await withApiErrors(CatalogService.listProductsCatalogProductsGet({ page, pageSize: limit, productKind: "bundle" }))
    validateApiResponse(response, catalogPageContract, { method: "GET", path: "/catalog/products" })
    const products = await Promise.all(response.items!.map((item) => this.getProduct(item.slug)))
    const componentIds = Array.from(new Set(products.flatMap((product) => product.bundle_definition?.components?.map((component) => component.product_id) ?? [])))
    const componentProducts = await Promise.all(componentIds.map((id) => this.getProduct(id)))
    return products.map((product) => productToPack(product, componentProducts))
  },

  async getPack(packId: string): Promise<Pack> {
    const product = await this.getProduct(packId)
    const componentProducts = await Promise.all((product.bundle_definition?.components ?? []).map((component) => this.getProduct(component.product_id)))
    return productToPack(product, componentProducts)
  },

  formatOptionLabel(axis: string) {
    return titleCase(axis)
  },
}
