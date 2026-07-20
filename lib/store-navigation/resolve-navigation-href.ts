import type { StoreNavigationPublicItem } from "@/lib/api/generated"

type NavigationDestination = StoreNavigationPublicItem["destination"]

export type ResolvedNavigationHref = {
  href: string
  isExternal: boolean
  target?: "_blank"
  rel?: "noopener noreferrer"
}

export const SYSTEM_ROUTE_HREFS: Record<string, string | null> = {
  home: "/",
  catalog_all: "/products",
  bundle_listing: "/packs",
  search: null,
  cart: null,
  account: "/profile",
  contact: "/contact",
  vlog: "/vlog",
}

function safeInternalPath(path: string | null | undefined) {
  if (!path?.startsWith("/")) return null
  if (path.startsWith("//")) return null
  return path
}

function withNewTab(href: string, isExternal: boolean, openInNewTab: boolean): ResolvedNavigationHref {
  if (!openInNewTab) return { href, isExternal }
  return { href, isExternal, target: "_blank", rel: "noopener noreferrer" }
}

export function resolveNavigationHref(
  destination: NavigationDestination | null | undefined,
  openInNewTab = false,
): ResolvedNavigationHref | null {
  if (!destination || typeof destination.type !== "string") return null

  if (destination.type === "system_route") {
    const routeKey = "route_key" in destination ? destination.route_key : null
    if (!routeKey) return null
    const href = SYSTEM_ROUTE_HREFS[routeKey]
    return href ? withNewTab(href, false, openInNewTab) : null
  }

  if (destination.type === "catalog_category") {
    if ("is_broken" in destination && destination.is_broken) return null
    const slug = "target_slug" in destination ? destination.target_slug?.trim() : null
    return slug ? withNewTab(`/categories/${encodeURIComponent(slug)}`, false, openInNewTab) : null
  }

  if (destination.type === "catalog_product") {
    if ("is_broken" in destination && destination.is_broken) return null
    const slug = "target_slug" in destination ? destination.target_slug?.trim() : null
    if (!slug) return null
    const kind = "product_kind" in destination ? destination.product_kind : null
    const basePath = kind === "bundle" ? "/packs" : "/products"
    return withNewTab(`${basePath}/${encodeURIComponent(slug)}`, false, openInNewTab)
  }

  if (destination.type === "internal_path") {
    const path = "path" in destination ? safeInternalPath(destination.path) : null
    return path ? withNewTab(path, false, openInNewTab) : null
  }

  if (destination.type === "external_url") {
    const url = "url" in destination ? destination.url?.trim() : null
    if (!url || !/^https?:\/\//i.test(url)) return null
    return withNewTab(url, true, openInNewTab)
  }

  return null
}
