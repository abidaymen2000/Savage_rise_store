import type { CSSProperties } from "react"
import type { PublicStoreConfig } from "@/lib/api/generated"

export type StoreConfigFeatureKey = "packs" | "vlog" | "wishlist" | "reviews" | "loyalty"

export type StoreConfigResult = {
  config: PublicStoreConfig
  unavailable: boolean
}

export const STORE_CONFIG_REVALIDATE_SECONDS = 60

export const FALLBACK_STORE_CONFIG: PublicStoreConfig = {
  name: "Savage Rise",
  slug: "savage-rise",
  status: "active",
  country_code: "TN",
  default_currency: "TND",
  timezone: "Africa/Tunis",
  locale: "fr-TN",
  domain: "https://savagerise.com",
  favicon_url: "/icon.svg",
  branding: {
    primary_color: "#D4AF37",
  },
  feature_flags: {},
}

export function isFeatureEnabled(
  config: Pick<PublicStoreConfig, "feature_flags"> | null | undefined,
  key: StoreConfigFeatureKey,
  fallback = true,
): boolean {
  const value = config?.feature_flags?.[key]
  return typeof value === "boolean" ? value : fallback
}

export function getStoreDisplayName(config: Pick<PublicStoreConfig, "name">): string {
  return config.name
}

export function getStoreLocale(config: Pick<PublicStoreConfig, "locale"> | null | undefined): string {
  return config?.locale || FALLBACK_STORE_CONFIG.locale
}

export function getStoreCurrency(config: Pick<PublicStoreConfig, "default_currency"> | null | undefined): string {
  return config?.default_currency || FALLBACK_STORE_CONFIG.default_currency
}

export function formatStorePrice(
  price: number,
  config?: Pick<PublicStoreConfig, "locale" | "default_currency"> | null,
): string {
  const locale = getStoreLocale(config)
  const currency = getStoreCurrency(config)

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(Number(price || 0))
  } catch {
    return `${Number(price || 0).toFixed(2)} ${currency}`
  }
}

export function normalizeUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  try {
    return new URL(value).toString()
  } catch {
    return undefined
  }
}

export function normalizeDomain(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`
  return normalizeUrl(candidate)
}

export function getValidSocialLinks(socialLinks: PublicStoreConfig["social_links"]) {
  return Object.entries(socialLinks ?? {})
    .map(([platform, url]) => ({ platform: platform.toLowerCase(), label: platform, url: normalizeUrl(url) }))
    .filter((entry): entry is { platform: string; label: string; url: string } => Boolean(entry.url))
}

function isValidCssColor(value: string | null | undefined): value is string {
  if (!value) return false
  return (
    /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value) ||
    /^rgba?\([\d\s.,%+-]+\)$/i.test(value) ||
    /^hsla?\([\d\s.,%+-]+(?:deg|rad|turn)?[\d\s.,%+-]*\)$/i.test(value)
  )
}

export function getBrandingCssVariables(config: PublicStoreConfig): CSSProperties {
  const branding = config.branding
  return {
    ...(isValidCssColor(branding?.primary_color) ? { "--store-primary": branding.primary_color } : {}),
    ...(isValidCssColor(branding?.secondary_color) ? { "--store-secondary": branding.secondary_color } : {}),
    ...(isValidCssColor(branding?.accent_color) ? { "--store-accent": branding.accent_color } : {}),
  } as CSSProperties
}
