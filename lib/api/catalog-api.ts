import {
  CatalogService,
  type BundleComponent,
  type CategoryRead,
  type ProductListItem,
  type ProductStorefrontDetail,
  type ProductVariantRead,
} from "./generated"
import { withApiErrors } from "./api-error"
import type { Category, Pack, PackComponent, PackProductSummary, Product, ProductImage, SearchFilters, SizeStock, Variant } from "@/types/api"

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

function variantToLegacy(variant: ProductVariantRead, productPrice: number, productKind?: string): Variant {
  const entries = optionEntries(variant)
  const bundleWithoutOptions = productKind === "bundle" && !hasDisplayableOptionValues(variant)
  const first = bundleWithoutOptions ? "" : entries[0]?.[1] ?? variant.title
  const second = bundleWithoutOptions ? "" : entries[1]?.[1] ?? "default"
  const stockAvailable = toNumber(variant.attribute_values?.stock_available ?? variant.attribute_values?.stock ?? variant.attribute_values?.inventory, 999)
  const size: SizeStock | null = bundleWithoutOptions ? null : {
    size: second,
    stock_available: stockAvailable,
    stock: stockAvailable,
    sku: variant.sku ?? null,
    status: variant.status ?? null,
    variant_item_id: variant.id,
    meta_content_id: variant.id,
  }
  const variantPrice = toNumber(variant.base_price, productPrice)
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
      price: variantPrice,
      stock_available: stockAvailable,
      stock_on_hand: stockAvailable,
      in_stock: stockAvailable > 0 && variant.status !== "inactive" && variant.status !== "archived",
      status: variant.status ?? null,
    }],
    images: mediaToImages(variant.media),
    meta_content_id: variant.id,
    option_values: variant.option_values ?? {},
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
  const variants = (detail.variants ?? []).map((variant) => variantToLegacy(variant, price, detail.product_kind))
  const images = productMedia.length > 0 ? productMedia : variants.flatMap((variant) => variant.images)
  const inStock = detail.product_kind === "bundle" ? detail.status === "active" : variants.length === 0 || variants.some((variant) => variant.sizes.some((size) => (size.stock_available ?? size.stock ?? 0) > 0))

  return {
    id: detail.id,
    style_id: detail.slug,
    name: detail.name,
    full_name: detail.name,
    sku: firstVariant?.sku ?? null,
    description: detail.description ?? null,
    categories: detail.category_ids ?? [],
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

function listItemToProduct(item: ProductListItem): Product {
  return {
    id: item.id,
    style_id: item.slug,
    name: item.name,
    full_name: item.name,
    sku: null,
    categories: item.primary_category_id ? [item.primary_category_id] : [],
    price: 0,
    in_stock: item.status === "active",
    variants: [],
    slug: item.slug,
    product_kind: item.product_kind,
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
  async getProducts(skip = 0, limit = 10): Promise<Product[]> {
    const page = Math.floor(skip / limit) + 1
    const response = await withApiErrors(CatalogService.listProductsCatalogProductsGet({ page, pageSize: limit }))
    const details = await Promise.all((response.items ?? []).map((item) => this.getProduct(item.slug).catch(() => listItemToProduct(item))))
    return details
  },

  async getProduct(slugOrId: string): Promise<Product> {
    try {
      return detailToProduct(await withApiErrors(CatalogService.getProductCatalogProductsSlugGet({ slug: slugOrId })))
    } catch (error) {
      const response = await withApiErrors(CatalogService.listProductsCatalogProductsGet({ page: 1, pageSize: 100 }))
      const item = (response.items ?? []).find((product) => product.id === slugOrId || product.slug === slugOrId)
      if (!item) throw error
      return detailToProduct(await withApiErrors(CatalogService.getProductCatalogProductsSlugGet({ slug: item.slug })))
    }
  },

  async searchProducts(filters: SearchFilters, skip = 0, limit = 10): Promise<Product[]> {
    const page = Math.floor(skip / limit) + 1
    const response = await withApiErrors(CatalogService.listProductsCatalogProductsGet({
      page,
      pageSize: limit,
      q: filters.text,
      productKind: filters.sort === "packs" ? "bundle" : undefined,
    }))
    return Promise.all((response.items ?? []).map((item) => this.getProduct(item.slug).catch(() => listItemToProduct(item))))
  },

  async getCategories(): Promise<Category[]> {
    return (await withApiErrors(CatalogService.listCategoriesCatalogCategoriesGet())).map(categoryToLegacy)
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
    return Promise.all((response.items ?? []).map((item) => this.getProduct(item.slug).catch(() => listItemToProduct(item))))
  },

  async getPacks(skip = 0, limit = 20): Promise<Pack[]> {
    const page = Math.floor(skip / limit) + 1
    const response = await withApiErrors(CatalogService.listProductsCatalogProductsGet({ page, pageSize: limit, productKind: "bundle" }))
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
