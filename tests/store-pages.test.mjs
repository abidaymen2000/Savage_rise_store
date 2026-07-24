import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8")
}

test("storefront pages generated client is available", () => {
  const index = read("lib/api/generated/index.ts")
  const service = read("lib/api/generated/services/StorefrontPagesService.ts")
  const wrapper = read("lib/api/store-pages-api.ts")

  assert.match(index, /StorefrontPagesService/)
  assert.match(index, /StorePagePublicOut/)
  assert.match(service, /\/storefront\/pages\/\{slug\}/)
  assert.match(wrapper, /StorefrontPagesService\.storefrontGetStorePage/)
})

test("static store routes read CMS content with local fallback", () => {
  for (const route of ["about", "help", "shipping", "returns", "size-guide"]) {
    const source = read(`app/${route}/page.tsx`)
    assert.match(source, new RegExp(`slug="${route}"`))
    assert.match(source, /generateStorePageMetadata/)
    assert.equal(source.includes("const helpItems"), false)
    assert.equal(source.includes("const sizeRows"), false)
  }

  const contact = read("app/contact/page.tsx")
  assert.match(contact, /getPublishedStorePage\("contact"\)/)
  assert.match(contact, /ContactPageClient/)
})

test("store page renderer supports all CMS block types", () => {
  const renderer = read("components/store-pages/store-page-renderer.tsx")
  for (const blockType of ["hero", "rich_text", "image", "cards", "faq", "table", "contact_info", "map"]) {
    assert.match(renderer, new RegExp(`block\\.type === "${blockType}"`))
  }
})

test("fallback data covers current static store pages", () => {
  const fallback = read("lib/store-pages/static-pages.ts")
  for (const slug of ["about", "help", "shipping", "returns", "size-guide", "contact"]) {
    assert.match(fallback, new RegExp(`slug: "${slug}"`))
  }
})
