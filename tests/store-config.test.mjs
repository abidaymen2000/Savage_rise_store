import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  FALLBACK_STORE_CONFIG,
  formatStorePrice,
  getBrandingCssVariables,
  getValidSocialLinks,
  isFeatureEnabled,
  STORE_CONFIG_REVALIDATE_SECONDS,
} from "@/lib/store-config-shared"

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

test("uses the generated public storefront config endpoint", () => {
  const service = read("lib/api/generated/services/StoreInstanceService.ts")
  const wrapper = read("lib/api/store-config-api.ts")

  assert.match(service, /url: '\/storefront\/config'/)
  assert.match(wrapper, /StoreInstanceService\.storefrontConfigStorefrontConfigGet/)
})

test("store surfaces do not call the admin instance endpoint", () => {
  const files = [
    "app/layout.tsx",
    "app/components/Header.tsx",
    "app/components/Footer.tsx",
    "app/contact/page.tsx",
    "lib/store-config.ts",
    "lib/store-config-shared.ts",
  ]

  for (const file of files) {
    assert.equal(read(file).includes("/admin/instance"), false, `${file} should not call /admin/instance`)
  }
})

test("store config helper caches and falls back only for API unavailability", () => {
  const helper = read("lib/store-config.ts")

  assert.equal(STORE_CONFIG_REVALIDATE_SECONDS, 60)
  assert.match(helper, /unstable_cache/)
  assert.match(helper, /cache\(async/)
  assert.equal(FALLBACK_STORE_CONFIG.locale, "fr-TN")
  assert.equal(FALLBACK_STORE_CONFIG.default_currency, "TND")
})

test("feature flags preserve explicit false values", () => {
  assert.equal(isFeatureEnabled({ feature_flags: { wishlist: false } }, "wishlist", true), false)
  assert.equal(isFeatureEnabled({ feature_flags: {} }, "wishlist", true), true)
})

test("branding variables accept valid colors and reject invalid values", () => {
  assert.deepEqual(
    getBrandingCssVariables({
      ...FALLBACK_STORE_CONFIG,
      branding: {
        primary_color: "#111111",
        secondary_color: "not-a-color",
        accent_color: "rgb(255, 255, 255)",
      },
    }),
    {
      "--store-primary": "#111111",
      "--store-accent": "rgb(255, 255, 255)",
    },
  )
})

test("social links keep only valid URLs", () => {
  const links = getValidSocialLinks({
    instagram: "https://instagram.example/savage",
    tiktok: "not valid",
    whatsapp: "https://wa.me/21600000000",
  })

  assert.deepEqual(links.map((link) => link.platform), ["instagram", "whatsapp"])
})

test("shared price formatter uses configured locale and currency", () => {
  assert.match(formatStorePrice(12, { locale: "fr-TN", default_currency: "TND" }), /12/)
})

test("layout metadata, status page and branding are driven by PublicStoreConfig", () => {
  const layout = read("app/layout.tsx")

  assert.match(layout, /generateMetadata/)
  assert.match(layout, /getStoreConfig/)
  assert.match(layout, /metadataBase/)
  assert.match(layout, /favicon_url/)
  assert.match(layout, /openGraph/)
  assert.match(layout, /getBrandingCssVariables/)
  assert.match(layout, /maintenance/)
  assert.match(layout, /inactive/)
  assert.equal(layout.includes("v0.dev"), false)
})

test("header, footer and contact consume dynamic store config", () => {
  const header = read("app/components/Header.tsx")
  const footer = read("app/components/Footer.tsx")
  const contact = read("app/contact/page.tsx")

  assert.match(header, /useStoreConfig/)
  assert.match(header, /logo_url/)
  assert.match(header, /logo_alt/)
  assert.match(header, /isFeatureEnabled\(config, "wishlist"/)
  assert.match(footer, /contact_email/)
  assert.match(footer, /contact_phone/)
  assert.match(footer, /getValidSocialLinks/)
  assert.match(footer, /getFullYear/)
  assert.match(contact, /contact_email/)
  assert.match(contact, /contact_phone/)
  assert.match(contact, /whatsapp/)
})
