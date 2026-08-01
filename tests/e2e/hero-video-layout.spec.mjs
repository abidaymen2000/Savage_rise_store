import { expect, test } from "@playwright/test"

const viewports = [
  { width: 1365, height: 768 },
  { width: 1440, height: 900 },
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
]

for (const viewport of viewports) {
  test(`hero video fills media container at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/", { waitUntil: "domcontentloaded" })

    const media = page.locator("[data-hero-media]").first()
    await expect(media).toBeVisible()

    const video = media.locator("video").first()
    await expect(video).toBeAttached({ timeout: 7000 })
    await video.evaluate((element) => {
      const videoElement = element
      if (videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return
      return new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error("Hero video did not load in time")), 7000)
        videoElement.addEventListener("loadeddata", () => {
          window.clearTimeout(timeout)
          resolve(undefined)
        }, { once: true })
      })
    })

    const boxes = await media.evaluate((container) => {
      const videoElement = container.querySelector("video")
      if (!videoElement) throw new Error("Hero video not found")
      const mediaRect = container.getBoundingClientRect()
      const videoRect = videoElement.getBoundingClientRect()
      return {
        media: { x: mediaRect.x, y: mediaRect.y, width: mediaRect.width, height: mediaRect.height },
        video: { x: videoRect.x, y: videoRect.y, width: videoRect.width, height: videoRect.height },
      }
    })

    const tolerance = 2
    expect(Math.abs(boxes.media.x - boxes.video.x)).toBeLessThanOrEqual(tolerance)
    expect(Math.abs(boxes.media.y - boxes.video.y)).toBeLessThanOrEqual(tolerance)
    expect(Math.abs(boxes.media.width - boxes.video.width)).toBeLessThanOrEqual(tolerance)
    expect(Math.abs(boxes.media.height - boxes.video.height)).toBeLessThanOrEqual(tolerance)
  })
}
