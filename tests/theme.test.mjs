import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

test("theme provider uses next-themes with system light and dark modes", () => {
  const provider = read("components/theme-provider.tsx")
  const layout = read("app/layout.tsx")

  assert.match(provider, /next-themes/)
  assert.match(layout, /<ThemeProvider/)
  assert.match(layout, /attribute="class"/)
  assert.match(layout, /defaultTheme="system"/)
  assert.match(layout, /enableSystem/)
  assert.match(layout, /disableTransitionOnChange/)
  assert.match(layout, /suppressHydrationWarning/)
})

test("theme toggle exposes system light and dark choices on desktop and mobile", () => {
  const toggle = read("app/components/ThemeToggle.tsx")
  const header = read("app/components/Header.tsx")

  assert.match(toggle, /useTheme/)
  assert.match(toggle, /setMounted\(true\)/)
  assert.match(toggle, /if \(!mounted\) return null/)
  assert.match(toggle, /value: "system"/)
  assert.match(toggle, /value: "light"/)
  assert.match(toggle, /value: "dark"/)
  assert.match(toggle, /DropdownMenuRadioGroup/)
  assert.match(toggle, /localStorage|next-themes|setTheme/)
  assert.match(header, /<ThemeToggle \/>/)
  assert.match(header, /<ThemeToggle mobile \/>/)
})

test("global CSS defines light and dark semantic store tokens", () => {
  const css = read("app/globals.css")

  assert.match(css, /--background: 42 30% 96%/)
  assert.match(css, /--foreground: 24 12% 9%/)
  assert.match(css, /--surface: 40 24% 93%/)
  assert.match(css, /--surface-elevated: 40 30% 98%/)
  assert.match(css, /--card: 40 30% 98%/)
  assert.match(css, /--muted: 38 18% 89%/)
  assert.match(css, /--primary: 24 12% 9%/)
  assert.match(css, /--accent: 43 58% 48%/)
  assert.match(css, /--ring: 43 58% 48%/)
  assert.match(css, /\.dark\s*\{/)
  assert.doesNotMatch(css, /!important/)
})

test("pack cards use semantic theme tokens without duplicate components", () => {
  const featured = read("app/components/FeaturedProducts.tsx")
  const packs = read("app/packs/page.tsx")
  const packDetail = read("app/packs/[id]/page.tsx")

  assert.match(featured, /bg-card/)
  assert.match(featured, /text-card-foreground/)
  assert.match(packs, /bg-background/)
  assert.match(packs, /text-foreground/)
  assert.match(packDetail, /bg-background|bg-card/)
  assert.equal((featured.match(/function ActivePackCard/g) ?? []).length, 1)
  assert.equal((packs.match(/function PackCard/g) ?? []).length, 1)
})

test("newsletter uses light theme tokens and keeps dark gradient only in dark mode", () => {
  const newsletter = read("app/components/Newsletter.tsx")

  assert.match(newsletter, /bg-muted/)
  assert.match(newsletter, /text-foreground/)
  assert.match(newsletter, /dark:bg-gradient-to-r/)
  assert.doesNotMatch(newsletter, /className="py-20 bg-gradient-to-r from-gray-900 to-black"/)
})

test("vlog chapter empty and drop cards are light-theme aware", () => {
  const vlog = read("app/vlog/page.tsx")

  assert.match(vlog, /The first chapter is being prepared/)
  assert.match(vlog, /theme-aware-card/)
  assert.match(vlog, /theme-aware-secondary/)
})

test("hero image background is softened while video behavior remains separate", () => {
  const hero = read("app/components/Hero.tsx")

  assert.match(hero, /slide\.type === "video"/)
  assert.match(hero, /blur-\[3px\] brightness-\[0\.76\]/)
  assert.match(hero, /blur-\[7px\] brightness-\[0\.68\]/)
  assert.match(hero, /text-\[rgba\(255,255,255,0\.98\)\]/)
})

test("hero video and poster share the full media rectangle", () => {
  const hero = read("app/components/Hero.tsx")
  const video = read("components/storefront/media/storefront-video.tsx")

  assert.match(hero, /className="absolute inset-0 h-full w-full overflow-hidden"/)
  assert.match(video, /data-hero-media/)
  assert.match(video, /className="absolute inset-0 block h-full w-full object-cover/)
  assert.match(video, /style=\{\{ objectPosition \}\}/)
  assert.doesNotMatch(video, /object-contain/)
  assert.doesNotMatch(video, /aspect-\[9\/16\]|aspect-video|max-w-|w-auto|w-fit|mx-auto/)
})

test("catalog product cards use light and dark semantic tokens", () => {
  const productCard = read("components/storefront/product-card.tsx")
  const actions = read("components/storefront/product-card-actions.tsx")
  const productsPage = read("app/products/page.tsx")
  const controls = read("app/products/products-controls.tsx")

  assert.match(productCard, /bg-card/)
  assert.match(productCard, /text-card-foreground/)
  assert.match(actions, /bg-primary/)
  assert.match(productsPage, /bg-background/)
  assert.match(productsPage, /text-foreground/)
  assert.match(controls, /bg-card/)
  assert.doesNotMatch(productCard, /bg-\[#080807\]|text-white|border-stone-800/)
  assert.doesNotMatch(productsPage, /bg-\[#050504\]|text-white/)
})

test("cart and checkout surfaces are tokenized for light mode", () => {
  const cart = read("app/components/Cart.tsx")
  const checkout = read("app/checkout/page.tsx")

  assert.match(cart, /bg-background/)
  assert.match(cart, /text-foreground/)
  assert.match(cart, /bg-card/)
  assert.match(checkout, /bg-background/)
  assert.match(checkout, /bg-card/)
  assert.doesNotMatch(cart, /className="[^"]*(?<!dark:)bg-black[^"]*(?<!dark:)text-white/)
  assert.doesNotMatch(checkout, /className="[^"]*(?<!dark:)bg-black[^"]*(?<!dark:)text-white/)
})
