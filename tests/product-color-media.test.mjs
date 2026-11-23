import test from 'node:test'
import assert from 'node:assert/strict'
import { getProductColorSlides, getProductColorGalleries, getProductImagesForColor, PRODUCT_IMAGE_FALLBACK } from '../lib/product-color-media.ts'
import { catalogApi } from '../lib/api/catalog-api.ts'
import { CatalogService } from '../lib/api/api-client.ts'

const image = (id, primary = false, order = 0) => ({ id, url: `https://ik.imagekit.io/test/${id}.jpg`, is_primary: primary, order })
function product(colors = ['Black', 'White', 'Bordeaux', 'Pink', 'Brown', 'Green']) {
  return { id: 'p', name: 'Hoodie', price: 89.9, availability_status: 'available', images: [],
    variants: colors.flatMap((color, c) => ['XS', 'S', 'M', 'L', 'XL'].map((size, s) => ({
      id: `${color}-${size}`, position: c * 5 + s, color, option_values: { size, color }, sizes: [{ size, stock_available: 20 }],
      images: [image(`${color}-secondary`, false, 0), image(`${color}-primary`, true, 5)],
    }))) }
}

test('30 sizes produce exactly six ERP primaries in ERP color order, without mutation', () => {
  const p = product(), before = structuredClone(p)
  assert.deepEqual(getProductColorSlides(p).map(i => i.id), ['Black', 'White', 'Bordeaux', 'Pink', 'Brown', 'Green'].map(c => `${c}-primary`))
  assert.deepEqual(p, before)
})
test('one or two colors produce one or two slides regardless of sizes and secondary photos', () => {
  for (const colors of [['Black'], ['Black', 'White']]) assert.equal(getProductColorSlides(product(colors)).length, colors.length)
})
test('gallery depends only on color, combines size-shared IDs without duplicates', () => {
  const p = product()
  p.variants.find(v => v.id === 'Black-L').images = []
  const fromM = getProductImagesForColor(p, p.variants.find(v => v.id === 'Black-M').color)
  const fromL = getProductImagesForColor(p, p.variants.find(v => v.id === 'Black-L').color)
  assert.deepEqual(fromM, fromL)
  assert.deepEqual(fromL.map(i => i.id), ['Black-primary', 'Black-secondary'])
  assert.deepEqual(getProductImagesForColor(p, 'Bordeaux').map(i => i.id), ['Bordeaux-primary', 'Bordeaux-secondary'])
})
test('explicit primary on a later size wins; fallback order is used only without any primary', () => {
  const p = product(['Black'])
  p.variants.forEach(v => { v.images = [image('secondary', false, 0)] })
  p.variants[4].images.push(image('explicit', true, 10))
  assert.equal(getProductColorSlides(p)[0].id, 'explicit')
  p.variants[4].images[1].is_primary = false
  assert.equal(getProductColorSlides(p)[0].id, 'secondary')
})
test('equivalent normalized color labels merge, not other colors or size-only axes', () => {
  const p = product([' Green ', 'GREEN', 'Pink'])
  assert.equal(getProductColorGalleries(p).length, 2)
  p.variants = [{ id: 'size', color: 'M', option_values: { size: 'M' }, images: [image('size')] }]
  assert.deepEqual(getProductColorGalleries(p), [])
})
test('missing images use product primary then placeholder; identical assets/URLs never repeat', () => {
  const p = product(['Black', 'White'])
  p.variants.forEach(v => { v.images = [] })
  assert.equal(getProductColorSlides(p)[0].url, PRODUCT_IMAGE_FALLBACK)
  p.images = [image('secondary'), image('default-primary', true)]
  assert.deepEqual(getProductColorSlides(p).map(i => i.id), ['default-primary'])
  p.variants.forEach(v => { v.images = [image('shared', true)] })
  assert.equal(getProductColorSlides(p).length, 1)
  assert.equal(getProductImagesForColor(p, 'Black').length, 1)
})
test('adapter retains primary, ERP swatch and position and resolves color/size by axis name', async () => {
  const original = CatalogService.getProductCatalogProductsSlugGet
  CatalogService.getProductCatalogProductsSlugGet = async () => ({ id: 'p', name: 'Hoodie', slug: 'hoodie', option_axes: [{code:'color',values:[{code:'Green',swatch:'#596643'}]}], variants: [{
    id: 'v', title: 'M / Green', position: 11, base_price: '89.900', option_values: { size: 'M', color: 'Green' },
    media: [{ asset_id: 'secondary', url: '/second.jpg', position: 0 }, { asset_id: 'primary', url: '/primary.jpg', is_primary: true, position: 4 }],
    inventory: { availability_status: 'available', stock_available: 3 },
  }] })
  try {
    const p = await catalogApi.getProduct('hoodie')
    assert.equal(p.price, 89.9)
    assert.equal(p.variants[0].color, 'Green')
    assert.equal(getProductColorGalleries(p)[0].colorCode, '#596643')
    assert.equal(p.variants[0].sizes[0].size, 'M')
    assert.equal(p.variants[0].position, 11)
    assert.equal(getProductColorSlides(p)[0].id, 'primary')
    assert.equal(p.variants[0].inventory.stock_available, 3)
  } finally { CatalogService.getProductCatalogProductsSlugGet = original }
})
