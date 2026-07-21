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

  assert.match(css, /--store-background: #f5f1e8/i)
  assert.match(css, /--store-surface: #fffdf8/i)
  assert.match(css, /--store-surface-secondary: #ede7dc/i)
  assert.match(css, /--store-text-primary: #111111/i)
  assert.match(css, /--store-text-secondary: #625e57/i)
  assert.match(css, /--store-border: #d8d0c3/i)
  assert.match(css, /--store-accent-hover: #b99423/i)
  assert.match(css, /\.dark\s*\{/)
  assert.match(css, /theme-aware-pack-card/)
})

test("pack cards have light and dark aware styling hooks without duplicate components", () => {
  const featured = read("app/components/FeaturedProducts.tsx")
  const packs = read("app/packs/page.tsx")
  const packDetail = read("app/packs/[id]/page.tsx")

  assert.match(featured, /theme-aware-pack-card/)
  assert.match(packs, /theme-aware-pack-card/)
  assert.match(packDetail, /theme-aware-pack-card/)
  assert.equal((featured.match(/function ActivePackCard/g) ?? []).length, 1)
  assert.equal((packs.match(/function PackCard/g) ?? []).length, 1)
})

test("newsletter uses light theme tokens and keeps dark gradient only in dark mode", () => {
  const newsletter = read("app/components/Newsletter.tsx")

  assert.match(newsletter, /bg-\[var\(--surface-secondary\)\]/)
  assert.match(newsletter, /text-\[var\(--foreground\)\]/)
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
