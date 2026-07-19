import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product } from "@/types/api"
import { getAvailableStock, productHasPurchasableVariant } from "@/lib/inventory"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFirstProductImage(product: Product): string {
  const productImages = (product as Product & { images?: Array<{ url: string }> }).images
  if (productImages?.[0]?.url) return productImages[0].url
  for (const variant of product.variants ?? []) {
    if (variant.images?.[0]?.url) return variant.images[0].url
  }
  return "/placeholder.svg?height=400&width=300"
}

export function getProductImageAlt(product: Product): string {
  for (const variant of product.variants ?? []) {
    if (variant.images?.[0]?.alt_text) return variant.images[0].alt_text
  }
  return product.name
}

export function getAllProductImages(product: Product): Array<{ url: string; alt_text: string }> {
  const images = [
    ...(((product as Product & { images?: Array<{ url: string; alt_text?: string | null }> }).images ?? []).map((image) => ({
      url: image.url,
      alt_text: image.alt_text || product.name,
    }))),
    ...(product.variants ?? []).flatMap((variant) =>
      (variant.images ?? []).map((image) => ({
        url: image.url,
        alt_text: image.alt_text || `${product.name} - ${variant.color}`,
      })),
    ),
  ]
  return images.length > 0 ? images : [{ url: "/placeholder.svg?height=400&width=300", alt_text: product.name }]
}

export function getAvailableColors(product: Product): string[] {
  if (product.product_kind === "bundle" && (!product.option_axes || product.option_axes.length === 0)) return []
  return Array.from(new Set((product.variants ?? []).map((variant) => variant.color).filter(Boolean)))
}

export function getAvailableSizes(product: Product, selectedColor?: string): string[] {
  if (product.product_kind === "bundle" && (!product.option_axes || product.option_axes.length === 0)) return []
  const variants = selectedColor ? product.variants?.filter((variant) => variant.color === selectedColor) : product.variants
  return Array.from(new Set((variants ?? []).flatMap((variant) => (variant.sizes ?? []).map((size) => size.size).filter((size) => size && size.toLowerCase() !== "default"))))
}

export function getStockForSize(product: Product, color: string, size: string): number {
  const variant = product.variants?.find((item) => item.color === color)
  const sizeStock = variant?.sizes?.find((item) => item.size === size)
  return getAvailableStock(sizeStock)
}

export function isProductInStock(product: Product): boolean {
  if (product.in_stock !== true) return false
  if (product.product_kind === "bundle") return product.in_stock
  return product.variants?.length ? productHasPurchasableVariant(product) : product.in_stock
}

export function sortProductsByStockStatus(products: Product[]): Product[] {
  return [...products].sort((a, b) => Number(isProductInStock(b)) - Number(isProductInStock(a)))
}

export function formatPrice(price: number): string {
  return `${Number(price || 0).toFixed(2)} TND`
}
