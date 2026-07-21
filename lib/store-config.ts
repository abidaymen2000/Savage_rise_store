import { cache } from "react"
import { unstable_cache } from "next/cache"
import { api } from "@/lib/api"
import {
  FALLBACK_STORE_CONFIG,
  STORE_CONFIG_REVALIDATE_SECONDS,
  type StoreConfigResult,
} from "@/lib/store-config-shared"

const loadApiStoreConfig = unstable_cache(
  async () => api.getStoreConfig(),
  ["storefront-config"],
  { revalidate: STORE_CONFIG_REVALIDATE_SECONDS },
)

let hasLoggedStoreConfigFailure = false

export const getStoreConfig = cache(async (): Promise<StoreConfigResult> => {
  try {
    return {
      config: await loadApiStoreConfig(),
      unavailable: false,
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production" && !hasLoggedStoreConfigFailure) {
      console.error("Unable to load public store config", error)
      hasLoggedStoreConfigFailure = true
    }
    return {
      config: FALLBACK_STORE_CONFIG,
      unavailable: true,
    }
  }
})
