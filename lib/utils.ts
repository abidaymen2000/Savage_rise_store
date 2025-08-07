import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product } from "@/types/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for product data
export function getFirstProductImage(product: Product): string {
  // Try to get the first image from the first variant
  if (product.variants && product.variants.length > 0) {
    const firstVariant = product.variants[0]
    if (firstVariant.images && firstVariant.images.length > 0) {
      return firstVariant.images[0].url
    }
  }

  // Fallback to placeholder
  return "/placeholder.svg?height=400&width=300"
}

export function getProductImageAlt(product: Product): string {
  // Try to get alt text from the first image of the first variant
  if (product.variants && product.variants.length > 0) {
    const firstVariant = product.variants[0]
    if (firstVariant.images && firstVariant.images.length > 0) {
      return firstVariant.images[0].alt_text || product.name
    }
  }

  return product.name
}

export function getAllProductImages(product: Product): Array<{ url: string; alt_text: string }> {
  const images: Array<{ url: string; alt_text: string }> = []

  if (product.variants) {
    product.variants.forEach((variant) => {
      if (variant.images) {
        variant.images.forEach((image) => {
          images.push({
            url: image.url,
            alt_text: image.alt_text || `${product.name} - ${variant.color}`,
          })
        })
      }
    })
  }

  return images.length > 0 ? images : [{ url: "/placeholder.svg?height=400&width=300", alt_text: product.name }]
}

export function getAvailableColors(product: Product): string[] {
  if (!product.variants) return []
  return product.variants.map((variant) => variant.color)
}

export function getAvailableSizes(product: Product, selectedColor?: string): string[] {
  if (!product.variants) return []

  if (selectedColor) {
    const variant = product.variants.find((v) => v.color === selectedColor)
    return variant ? variant.sizes.map((s) => s.size) : []
  }

  // Return all unique sizes across all variants
  const allSizes = new Set<string>()
  product.variants.forEach((variant) => {
    variant.sizes.forEach((size) => allSizes.add(size.size))
  })

  return Array.from(allSizes)
}

export function getStockForSize(product: Product, color: string, size: string): number {
  if (!product.variants) return 0

  const variant = product.variants.find((v) => v.color === color)
  if (!variant) return 0

  const sizeStock = variant.sizes.find((s) => s.size === size)
  return sizeStock ? sizeStock.stock : 0
}

export function isProductInStock(product: Product): boolean {
  if (!product.variants || product.variants.length === 0) return product.in_stock

  // Check if any variant has stock
  return product.variants.some((variant) => variant.sizes.some((size) => size.stock > 0))
}

export function formatPrice(price: number): string {
  return `${price.toFixed(2)} €`
}
