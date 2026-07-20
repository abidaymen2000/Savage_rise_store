import {
  StorefrontNavigationService,
  type StoreNavigationPublicMenu,
  type StoreNavigationPublicMenus,
} from "./generated"
import { withApiErrors } from "./api-error"

export type StoreNavigationSurface = "all" | "desktop" | "mobile"

type CacheEntry<T> = {
  expiresAt: number
  value: T
}

const CACHE_TTL_MS = 60_000
const menuCache = new Map<string, CacheEntry<StoreNavigationPublicMenu | null>>()
const menusCache = new Map<string, CacheEntry<StoreNavigationPublicMenus>>()

function cacheKey(parts: Array<string | undefined | null>) {
  return parts.filter(Boolean).join(":")
}

function readCache<T>(cache: Map<string, CacheEntry<T>>, key: string) {
  const entry = cache.get(key)
  if (!entry || entry.expiresAt < Date.now()) return null
  return entry.value
}

function writeCache<T>(cache: Map<string, CacheEntry<T>>, key: string, value: T) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  })
}

export const storeNavigationApi = {
  async getStoreNavigationMenu(code: string, surface: StoreNavigationSurface = "all") {
    const key = cacheKey(["menu", code, surface])
    const cached = readCache(menuCache, key)
    if (cached !== null) return cached

    const menu = await withApiErrors(StorefrontNavigationService.storefrontGetNavigationMenu({ code, surface }))
    writeCache(menuCache, key, menu)
    return menu
  },

  async listStoreNavigationMenus(codes?: string[], surface: StoreNavigationSurface = "all") {
    const codeParam = codes?.filter(Boolean).join(",")
    const key = cacheKey(["menus", codeParam ?? "all", surface])
    const cached = readCache(menusCache, key)
    if (cached) return cached

    const menus = await withApiErrors(
      StorefrontNavigationService.storefrontListNavigationMenus({
        codes: codeParam,
        surface,
      }),
    )
    writeCache(menusCache, key, menus)
    return menus
  },
}
