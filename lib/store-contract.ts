import type { PublicStoreConfig } from "@/lib/api/generated"

export type DeclaredStoreConfig = PublicStoreConfig & {
  store_id: string
  frontend_type: "standard" | "custom"
  configuration_source: "platform"
  configuration_error?: string | null
  store_domain_revision: number
  store_open: boolean
  public_url: string
}

/** Reject partial/old responses; absence is never interpreted as standard. */
export function declaredStoreConfig(value: unknown, expected?: { storeId?: string; engine?: "standard" | "custom"; domain?: string }): DeclaredStoreConfig {
  const config = value as DeclaredStoreConfig | null
  if (!config || config.configuration_source !== "platform" || config.configuration_error ||
      !["standard", "custom"].includes(config.frontend_type) || !/^s_[a-f0-9]{16}$/.test(config.store_id || "") ||
      typeof config.store_open !== "boolean" || !Number.isInteger(config.store_domain_revision) ||
      !/^[A-Z]{3}$/.test(config.default_currency || "") || !Object.hasOwn(config, "domain")) {
    throw new Error("The store configuration has not been confirmed by Platform.")
  }
  if ((expected?.storeId && config.store_id !== expected.storeId) || (expected?.engine && config.frontend_type !== expected.engine)) {
    throw new Error("This address no longer matches this storefront.")
  }
  if (config.frontend_type === "standard") {
    if (config.domain) throw new Error("The domain configuration is inconsistent.")
  } else {
    if (!config.domain || typeof config.domain !== "string") throw new Error("The custom domain is missing.")
    const hostname = config.domain.toLowerCase().replace(/^www\./, "")
    const address = new URL(config.public_url)
    if (address.protocol !== "https:" || address.hostname !== hostname || address.username || address.password ||
        address.port || address.pathname !== "/" || address.search || address.hash ||
        (expected?.domain && expected.domain.toLowerCase().replace(/^www\./, "") !== hostname)) {
      throw new Error("The custom storefront address does not match Platform.")
    }
  }
  return config
}
