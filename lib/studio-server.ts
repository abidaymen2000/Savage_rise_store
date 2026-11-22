import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { getApiBaseUrl, getStorefrontHeaders } from "@/lib/api/gateway-config.mjs"
import type { StudioDocument } from "@/lib/studio-contract"
import type { StoreNavigationPublicMenu, StorePagePublicOut } from "@/lib/api/generated"

export const previewCookie = "yovo_studio_preview"
export const getStudioDocument = cache(async (): Promise<(StudioDocument & { menus: StoreNavigationPublicMenu[]; pages: StorePagePublicOut[] }) | null> => {
  const token = cookies().get(previewCookie)?.value
  const response = await fetch(getApiBaseUrl() + (token ? "/storefront/studio/preview" : "/storefront/studio"), {
    headers: { ...getStorefrontHeaders(), ...(token ? { "X-Store-Preview-Token": token } : {}) },
    cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(20_000),
  })
  const result = await response.json().catch(() => null)
  if (!token && response.status === 423) return null
  if (!token && response.status === 404 && result?.detail?.code === "STUDIO_NOT_PUBLISHED") return null
  if (!response.ok || result?.manifest?.template_id !== "savage-rise" || result?.studio?.contract_version !== 3) {
    throw Object.assign(new Error("Le contenu de la boutique est momentanément indisponible."), { status: response.status })
  }
  return result
})
