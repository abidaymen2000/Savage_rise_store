import { cache } from "react"
import { api } from "@/lib/api"
import {
  FALLBACK_STORE_CONFIG,
  type StoreConfigResult,
} from "@/lib/store-config-shared"

import { declaredStoreConfig } from "@/lib/store-contract"
import { getStorefrontHeaders } from "@/lib/api/gateway-config.mjs"

let hasLoggedStoreConfigFailure = false

export const getStoreConfig = cache(async (): Promise<StoreConfigResult> => {
  try {
    return {
      config: declaredStoreConfig(await api.getStoreConfig(), { engine: "custom", domain: getStorefrontHeaders()["X-Store-Domain"] }),
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
