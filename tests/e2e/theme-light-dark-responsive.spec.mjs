import { expect, test } from "@playwright/test"

const routes = ["/", "/products", "/packs", "/cart", "/checkout"]
const screenshots = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]

async function setTheme(page, theme) {
  await page.addInitScript((nextTheme) => {
    window.localStorage.setItem("theme", nextTheme)
    document.documentElement.classList.toggle("dark", nextTheme === "dark")
  }, theme)
}

async function readThemeColors(page) {
  return page.evaluate(() => {
    const bodyStyles = window.getComputedStyle(document.body)
    const main = document.querySelector("main") ?? document.body
    const mainStyles = window.getComputedStyle(main)
    return {
      htmlDark: document.documentElement.classList.contains("dark"),
      bodyBackground: bodyStyles.backgroundColor,
      bodyColor: bodyStyles.color,
      mainBackground: mainStyles.backgroundColor,
      mainColor: mainStyles.color,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }
  })
}

test("theme toggle persists light mode after reload", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await page.evaluate(() => window.localStorage.setItem("theme", "light"))
  await page.reload({ waitUntil: "domcontentloaded" })

  const colors = await readThemeColors(page)
  expect(colors.htmlDark).toBe(false)
  expect(colors.bodyBackground).not.toBe("rgb(0, 0, 0)")
  expect(colors.bodyColor).not.toBe("rgb(255, 255, 255)")
})

for (const route of routes) {
  test(`light and dark theme affect ${route}`, async ({ page }) => {
    await setTheme(page, "dark")
    await page.goto(route, { waitUntil: "domcontentloaded" })
    const dark = await readThemeColors(page)

    await setTheme(page, "light")
    await page.goto(route, { waitUntil: "domcontentloaded" })
    const light = await readThemeColors(page)

    expect(light.htmlDark).toBe(false)
    expect(light.bodyBackground).not.toBe(dark.bodyBackground)
    expect(light.bodyColor).not.toBe(dark.bodyColor)
    expect(light.scrollWidth).toBeLessThanOrEqual(light.clientWidth + 2)
  })
}

for (const viewport of screenshots) {
  for (const theme of ["light", "dark"]) {
    test(`captures ${theme} storefront screenshot at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await setTheme(page, theme)
      await page.goto("/", { waitUntil: "domcontentloaded" })
      await page.screenshot({ path: `test-results/theme-${theme}-${viewport.name}.png`, fullPage: true })
    })
  }
}
