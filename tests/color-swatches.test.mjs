import assert from "node:assert/strict"
import test from "node:test"
import { getColorSwatch } from "@/lib/color-swatches"

test("maps French and store-specific color names to visible swatches", () => {
  assert.equal(getColorSwatch("grige"), "#b8ad9a")
  assert.equal(getColorSwatch("greige"), "#b8ad9a")
  assert.equal(getColorSwatch("gris"), "#808080")
  assert.equal(getColorSwatch("bleu ciel"), "#87ceeb")
})

test("keeps explicit color codes from variants", () => {
  assert.equal(getColorSwatch("#7dd3fc"), "#7dd3fc")
  assert.equal(getColorSwatch("rgb(125, 211, 252)"), "rgb(125, 211, 252)")
})

test("unknown future variant names get a deterministic non-black color", () => {
  const swatch = getColorSwatch("future custom color")

  assert.match(swatch, /^hsl\(\d+ 58% 62%\)$/)
  assert.notEqual(swatch, "#111111")
})
