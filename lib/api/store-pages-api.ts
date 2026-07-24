import { StorefrontPagesService } from "./generated"
import type { StorePagePublicOut, StorePageSummaryOut, StorePageType } from "./generated"
import { withApiErrors } from "./api-error"

export function getStorePage(slug: string): Promise<StorePagePublicOut> {
  return withApiErrors(StorefrontPagesService.storefrontGetStorePage({ slug }))
}

export function listStorePages(params: { keys?: string | null; slugs?: string | null; pageType?: StorePageType | null } = {}): Promise<StorePageSummaryOut[]> {
  return withApiErrors(StorefrontPagesService.storefrontListStorePages(params))
}
