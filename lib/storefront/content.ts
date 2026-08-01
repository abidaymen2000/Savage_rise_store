import { storefrontFallbackContent } from "./content-fallbacks"

export function getStorefrontContent() {
  return storefrontFallbackContent
}

export function getAnnouncementLabel() {
  return getStorefrontContent().announcement.join(" · ")
}
