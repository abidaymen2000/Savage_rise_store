import type { StoreNavigationPublicItem } from "@/lib/api/generated"
import type { StoreNavigationSurface } from "@/lib/api/store-navigation-api"

export function isItemVisibleOnSurface(item: StoreNavigationPublicItem, surface: StoreNavigationSurface) {
  return item.visibility === "all" || surface === "all" || item.visibility === surface
}

export function filterNavigationItemsBySurface(
  items: StoreNavigationPublicItem[] | undefined,
  surface: StoreNavigationSurface,
): StoreNavigationPublicItem[] {
  return (items ?? [])
    .filter((item) => isItemVisibleOnSurface(item, surface))
    .sort((a, b) => a.position - b.position)
    .map((item) => ({
      ...item,
      children: filterNavigationItemsBySurface(item.children, surface),
    }))
}

export function collectNavigationLabels(items: StoreNavigationPublicItem[] | undefined): string[] {
  return (items ?? []).flatMap((item) => [item.label, ...collectNavigationLabels(item.children)])
}
