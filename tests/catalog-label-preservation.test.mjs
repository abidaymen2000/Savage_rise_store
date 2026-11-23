import test from 'node:test'
import assert from 'node:assert/strict'
import { catalogOptionDisplay } from '../lib/catalog-option-display.ts'
import { getProductColorGalleries, getProductColorSlides } from '../lib/product-color-media.ts'
import { CatalogService } from '../lib/api/api-client.ts'
import { catalogApi } from '../lib/api/catalog-api.ts'

const labels = ['Brown', 'Red', 'Pink', 'Green', 'White', 'Dark Black']

test('ERP color labels remain exact while technical option codes keep selecting variants', () => {
  for (const [index, label] of labels.entries()) {
    const variant = { option_values: { color: `option-${index}`, size: 'size-id' }, option_value_labels: { color: 'obsolete', size: 'obsolete' } }
    const axes = [{ code: 'color', values: [{ id: `option-${index}`, code: `technical_${index}`, label }] }, { code: 'size', values: [{ id: 'size-id', code: 'xl', label: 'XL' }] }]
    const before = structuredClone({ variant, axes })
    const display = catalogOptionDisplay(variant, axes)
    assert.equal(display.color.label, label)
    assert.equal(display.color.value, `technical_${index}`)
    assert.equal(display.size, 'XL')
    assert.deepEqual({ variant, axes }, before)
  }
})

test('labels preserve case, spacing, underscores and non-English characters without leaking unresolved IDs', () => {
  for (const label of ['Dark_Black', '  DARK Black  ', 'Écru', 'أبيض']) {
    const display = catalogOptionDisplay({ option_values: { color: 'code' }, option_value_labels: { color: label } })
    assert.equal(display.color.label, label)
    assert.equal(display.labels.color, label)
  }
  assert.equal(catalogOptionDisplay({ option_values: { color: 'a'.repeat(24) } }).color.label, 'Unavailable value')
})

test('catalog adapter and image galleries preserve ERP names, labels, technical values and one primary per color', async () => {
  const original = CatalogService.getProductCatalogProductsSlugGet
  const response = {
    id: 'p', slug: 'p', name: 'Nom ERP — Keep_Me', description: 'Description publiée, inchangée.',
    category_ids: ['category'], primary_category_id: 'category', in_stock: true,
    option_axes: [{code:'color',values:labels.map((label,index)=>({id:`c-${index}`,code:`code_${index}`,label}))}],
    variants: labels.flatMap((label,index)=>['M','L'].map(size=>({
      id:`v-${index}-${size}`, title:`${label} / ${size}`, sku:`SKU_${index}_${size}`, position:index,
      option_values:{color:`c-${index}`,size}, base_price:'89.900', effective_price:'89.900',
      inventory:{availability_status:'available',stock_available:3},
      media:[{asset_id:`image-${index}`,url:`/image-${index}.jpg`,is_primary:true}],
    }))),
  }
  const before=structuredClone(response)
  CatalogService.getProductCatalogProductsSlugGet=async()=>response
  try {
    const product=await catalogApi.getProduct('p')
    assert.equal(product.name,response.name)
    assert.equal(product.description,response.description)
    assert.deepEqual(product.category_ids,response.category_ids)
    assert.deepEqual(getProductColorGalleries(product).map(group=>group.color),labels)
    assert.equal(getProductColorSlides(product).length,6)
    assert.deepEqual(product.variants.map(v=>v.option_values),response.variants.map(v=>v.option_values))
    assert.deepEqual(product.variants.map(v=>v.sku),response.variants.map(v=>v.sku))
    assert.equal(product.price,89.9)
    assert.deepEqual(response,before)
  } finally { CatalogService.getProductCatalogProductsSlugGet=original }
})
