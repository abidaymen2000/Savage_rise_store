import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { catalogApi } from '../lib/api/catalog-api.ts'
import { CatalogService } from '../lib/api/api-client.ts'
import imageLoader from '../image-loader.ts'

const oldUrl = 'https://ik.imagekit.io/account/savage-rise/photo.jpg'
const newUrl = 'https://ik.imagekit.io/account/tenants/test/catalog_product_image/intent/photo.jpg'

test('detail, primary, variant and listing failure fallback preserve CDN URLs', async () => {
  const originalDetail = CatalogService.getProductCatalogProductsSlugGet
  const originalList = CatalogService.listProductsCatalogProductsGet
  CatalogService.getProductCatalogProductsSlugGet = async () => ({ id: 'p', slug: 'p', name: 'P',
    media: [{ url: oldUrl, position: 0 }, { url: newUrl, is_primary: true, position: 1 }],
    variants: [{ id: 'v', title: 'Default', base_price: 25, media: [{ url: oldUrl }], option_values: {} }] })
  CatalogService.listProductsCatalogProductsGet = async () => ({ items: [{ id: 'p', slug: 'p', name: 'P',
    primary_image: { url: oldUrl } }], total: 1, page: 1, page_size: 10, pages: 1 })
  try {
    const product = await catalogApi.getProduct('p')
    assert.deepEqual(product.images.map(i => i.url), [newUrl, oldUrl])
    assert.equal(product.variants[0].images[0].url, oldUrl)
    CatalogService.getProductCatalogProductsSlugGet = async () => { throw new Error('offline') }
    const listing = await catalogApi.getProductsPage()
    assert.equal(listing.items[0].images[0].url, oldUrl)
  } finally {
    CatalogService.getProductCatalogProductsSlugGet = originalDetail
    CatalogService.listProductsCatalogProductsGet = originalList
  }
})

test('responsive loader preserves paths and adds CDN transformations only', () => {
  for (const src of [oldUrl, newUrl]) assert.equal(imageLoader({ src, width: 640 }), src + '?tr=w-640,q-75,f-auto')
  assert.equal(imageLoader({ src: '/placeholder.svg', width: 640 }), '/placeholder.svg')
  const source = readFileSync(new URL('../components/storefront/media/storefront-media.tsx', import.meta.url), 'utf8')
  assert.match(source, /sizes=\{sizes\}/)
  assert.doesNotMatch(source, /\/api\/media|admin\/media/)
})
