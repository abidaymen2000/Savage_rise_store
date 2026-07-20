import assert from "node:assert/strict"
import test from "node:test"
import { resolveNavigationHref, SYSTEM_ROUTE_HREFS } from "@/lib/store-navigation/resolve-navigation-href"
import { collectNavigationLabels, filterNavigationItemsBySurface } from "@/lib/store-navigation/navigation-utils"

const item = (overrides = {}) => ({
  id: overrides.id ?? "item",
  label: overrides.label ?? "Item",
  position: overrides.position ?? 0,
  visibility: overrides.visibility ?? "all",
  open_in_new_tab: overrides.open_in_new_tab ?? false,
  destination: overrides.destination ?? { type: "system_route", route_key: "home", enabled: true },
  children: overrides.children,
  badge: overrides.badge,
  icon: overrides.icon,
})

test("resolves system routes from the real Store route table", () => {
  assert.deepEqual(resolveNavigationHref({ type: "system_route", route_key: "home", enabled: true }), {
    href: "/",
    isExternal: false,
  })
  assert.equal(SYSTEM_ROUTE_HREFS.catalog_all, "/products")
  assert.equal(SYSTEM_ROUTE_HREFS.bundle_listing, "/packs")
  assert.equal(SYSTEM_ROUTE_HREFS.account, "/profile")
  assert.equal(SYSTEM_ROUTE_HREFS.contact, "/contact")
  assert.equal(SYSTEM_ROUTE_HREFS.vlog, "/vlog")
  assert.equal(resolveNavigationHref({ type: "system_route", route_key: "search", enabled: true }), null)
  assert.equal(resolveNavigationHref({ type: "system_route", route_key: "cart", enabled: true }), null)
})

test("resolves catalog category destinations from target_slug", () => {
  assert.deepEqual(
    resolveNavigationHref({ type: "catalog_category", target_id: "cat-1", target_slug: "drop-2", target_label: "Drop 2" }),
    { href: "/categories/drop-2", isExternal: false },
  )
})

test("resolves catalog product destinations by product_kind", () => {
  assert.deepEqual(
    resolveNavigationHref({ type: "catalog_product", target_id: "prod-1", target_slug: "tee", product_kind: "physical" }),
    { href: "/products/tee", isExternal: false },
  )
  assert.deepEqual(
    resolveNavigationHref({ type: "catalog_product", target_id: "pack-1", target_slug: "drop-2-pack", product_kind: "bundle" }),
    { href: "/packs/drop-2-pack", isExternal: false },
  )
})

test("resolves internal_path defensively", () => {
  assert.deepEqual(resolveNavigationHref({ type: "internal_path", path: "/about" }), {
    href: "/about",
    isExternal: false,
  })
  assert.equal(resolveNavigationHref({ type: "internal_path", path: "about" }), null)
  assert.equal(resolveNavigationHref({ type: "internal_path", path: "//example.com" }), null)
})

test("resolves external_url and secures open_in_new_tab", () => {
  assert.deepEqual(resolveNavigationHref({ type: "external_url", url: "https://savagerise.com" }, true), {
    href: "https://savagerise.com",
    isExternal: true,
    target: "_blank",
    rel: "noopener noreferrer",
  })
  assert.equal(resolveNavigationHref({ type: "external_url", url: "javascript:alert(1)" }, true), null)
})

test("ignores invalid or broken destinations", () => {
  assert.equal(resolveNavigationHref(null), null)
  assert.equal(resolveNavigationHref({ type: "catalog_category", target_id: "cat-1", target_slug: null }), null)
  assert.equal(resolveNavigationHref({ type: "catalog_product", target_id: "prod-1", target_slug: "tee", is_broken: true }), null)
})

test("filters header and mobile menus by visibility", () => {
  const items = [
    item({ id: "shop", label: "Shop", visibility: "all", position: 2 }),
    item({ id: "mobile-contact", label: "Contact", visibility: "mobile", position: 3 }),
    item({ id: "desktop-about", label: "About", visibility: "desktop", position: 1 }),
  ]

  assert.deepEqual(
    filterNavigationItemsBySurface(items, "desktop").map((entry) => entry.label),
    ["About", "Shop"],
  )
  assert.deepEqual(
    filterNavigationItemsBySurface(items, "mobile").map((entry) => entry.label),
    ["Shop", "Contact"],
  )
})

test("keeps recursive children for dropdown and accordion rendering", () => {
  const items = [
    item({
      id: "shop",
      label: "Shop",
      children: [
        item({
          id: "drop",
          label: "Drop 2",
          children: [item({ id: "tee", label: "Tee" })],
        }),
      ],
    }),
  ]

  assert.deepEqual(collectNavigationLabels(filterNavigationItemsBySurface(items, "desktop")), ["Shop", "Drop 2", "Tee"])
})

test("does not inject legacy category fallback labels", () => {
  const cmsItems = [
    item({ id: "shop", label: "Shop" }),
    item({ id: "packs", label: "Packs" }),
    item({ id: "chapters", label: "Chapters" }),
    item({ id: "about", label: "About" }),
  ]
  const labels = collectNavigationLabels(filterNavigationItemsBySurface(cmsItems, "desktop"))

  assert.equal(labels.includes("All products"), false)
  assert.equal(labels.includes("Bundles"), false)
  assert.equal(labels.includes("Clothing"), false)
})
