import { expect, test } from "@playwright/test"

const viewports = [
  { name: "320-light", width: 320, height: 568, theme: "light" },
  { name: "390-dark", width: 390, height: 844, theme: "dark" },
  { name: "430-light", width: 430, height: 932, theme: "light" },
]

for (const viewport of viewports) {
  test(`mobile menu overlay is fixed and opaque at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.addInitScript((theme) => {
      window.localStorage.setItem("theme", theme)
    }, viewport.theme)

    await page.goto("/products")
    await page.getByRole("button", { name: /ouvrir le menu/i }).click()

    const menu = page.locator("[data-mobile-menu]")
    await expect(menu).toBeVisible()

    const styles = await menu.evaluate((element) => {
      const style = window.getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      return {
        position: style.position,
        zIndex: Number(style.zIndex),
        backgroundColor: style.backgroundColor,
        bodyOverflow: document.body.style.overflow,
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      }
    })

    expect(styles.position).toBe("fixed")
    expect(styles.zIndex).toBeGreaterThanOrEqual(100)
    expect(styles.bodyOverflow).toBe("hidden")
    expect(styles.rect.top).toBeLessThanOrEqual(1)
    expect(styles.rect.left).toBeLessThanOrEqual(1)
    expect(Math.abs(styles.rect.width - styles.viewport.width)).toBeLessThanOrEqual(2)
    expect(styles.rect.height).toBeGreaterThanOrEqual(styles.viewport.height - 2)
    expect(styles.backgroundColor).not.toMatch(/rgba\([^)]*,\s*0(?:\.0+)?\)/)

    for (const label of ["Shop", "Packs", "Chapters", "About", "Contact"]) {
      await expect(page.getByRole("link", { name: new RegExp(label, "i") }).first()).toBeVisible()
    }

    const productAboveMenu = await page.locator("article").first().evaluate((product) => {
      const point = product.getBoundingClientRect()
      const element = document.elementFromPoint(point.left + 10, point.top + 10)
      return element ? product.contains(element) : false
    }).catch(() => false)
    expect(productAboveMenu).toBe(false)

    await page.getByRole("button", { name: /use (clair|sombre|systeme) theme/i }).first().click()
    await page.screenshot({ path: `test-results/mobile-menu-${viewport.name}.png`, fullPage: true })

    await page.getByRole("button", { name: /fermer le menu/i }).click()
    await expect(menu).toBeHidden()
    const restoredOverflow = await page.evaluate(() => document.body.style.overflow)
    expect(restoredOverflow).toBe("")
  })
}
