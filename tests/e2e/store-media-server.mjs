// Isolated catalogue/CMS fixture for the real Next storefront. Never forwards requests.
import http from 'node:http'
import { readFileSync } from 'node:fs'

const origin = 'http://127.0.0.1:49171'
const colors = ['Black', 'White', 'Bordeaux', 'Pink', 'Brown', 'Green']
const hex = ['#252525', '#dedbd3', '#6d2335', '#d6a5b6', '#795447', '#66705b']
export const svg = (color = 'Black', secondary = false) => `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="600" height="800" fill="#edeae3"/><path d="M230 150 Q300 85 370 150 L460 240 L408 335 L380 310 L390 650 L210 650 L220 310 L192 335 L140 240Z" fill="${hex[colors.indexOf(color)] || '#222'}"/><path d="M260 160 Q300 230 340 160" fill="none" stroke="#aaa" stroke-width="8"/><text x="300" y="725" text-anchor="middle" font-family="Arial" font-size="25" fill="#333">${color} · ${secondary ? 'Détail' : 'Principale'}</text><text x="300" y="770" text-anchor="middle" font-family="Arial" font-size="17" fill="#555">RECETTE LOCALE · MÉDIA SYNTHÉTIQUE</text></svg>`
const media = (color, primary, position = 0) => ({ asset_id: `${color}-${primary ? 'primary' : 'secondary'}`, url: `${origin}/images/${color}${primary ? '' : '-detail'}.svg`, alt_text: `${color} ${primary ? 'principale' : 'détail'}`, is_primary: primary, position })
const makeProduct = (id, selectedColors, soldOut = false) => ({
  id, slug: id, name: id === 'hoodie' ? 'SR OMBRA OVERSIZED HOODIE' : `Recette ${id}`, description: 'Produit de recette locale. Les images sont partagées entre les tailles.',
  product_kind: 'physical', status: 'active', category_ids: [], primary_category_id: null,
  // Even the deliberately imageless fixture has an authoritative commercial price.
  attribute_values: { price: '89.900' },
  in_stock: !soldOut, availability_status: soldOut ? 'out_of_stock' : 'available', media: [],
  variants: selectedColors.flatMap((color, c) => ['M', 'L', 'S', 'XL', 'XS'].map((size, s) => ({
    id: `${id}-${color}-${size}`, title: `${color} / ${size}`, sku: `FIXTURE-${color}-${size}`, position: c * 5 + s,
    option_values: { size, color }, option_value_labels: { size, color }, base_price: '89.900', effective_price: '89.900',
    currency: 'TND', status: 'active', product_id: id,
    inventory: { track_inventory: true, availability_status: soldOut ? 'out_of_stock' : 'available', in_stock: !soldOut },
    // Only M owns photos: L must still show this color's gallery, not another color's image.
    media: s === 0 ? [media(color, false, 0), media(color, true, 1)] : [],
  }))),
})
const products = [makeProduct('hoodie', colors), makeProduct('two-colors', colors.slice(0, 2)), makeProduct('one-color', ['Pink']), makeProduct('sold-out', ['Brown'], true), makeProduct('missing', [])]
const studio = {
  preview: false, revision: 1, menus: [], pages: [], hidden_paths: [],
  manifest: { template_id: 'savage-rise', pages: [] },
  studio: { template_id: 'savage-rise', contract_version: 3, visibility: {}, typography: {}, grids: {}, hero: {
    eyebrow: 'DISPONIBLE MAINTENANT', title: 'DROP-003', subtitle: 'Une pièce oversized inspirée par l’esprit rebelle de l’hiver tunisien.',
    primary_label: 'Commander maintenant', secondary_label: 'Découvrir FAZA',
    media: { url: `${origin}/film.webm`, mime: 'video/webm', alt: 'Film de recette DROP 003' },
    poster: { url: `${origin}/images/Black.svg`, mime: 'image/svg+xml', alt: 'Poster de recette DROP 003' },
  } },
}

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
  const url = new URL(req.url, origin), p = url.pathname
  const json = (body, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)) }
  if (p === '/health') return json({ fixture: true })
  if (p.startsWith('/images/')) {
    const color = p.split('/').at(-1).replace('.svg', '').replace('-detail', '')
    res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' }); res.end(svg(color, p.includes('-detail'))); return
  }
  if (p === '/film.webm') {
    if (!process.env.STORE_TEST_VIDEO) return json({ detail: 'Set STORE_TEST_VIDEO to a local test clip' }, 404)
    const data = readFileSync(process.env.STORE_TEST_VIDEO)
    const range = req.headers.range?.match(/bytes=(\d+)-(\d*)/)
    if (range) {
      const start = Number(range[1]), end = range[2] ? Number(range[2]) : data.length - 1
      res.writeHead(206, { 'Content-Type': 'video/webm', 'Content-Range': `bytes ${start}-${end}/${data.length}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 }); res.end(data.subarray(start, end + 1))
    } else { res.writeHead(200, { 'Content-Type': 'video/webm', 'Content-Length': data.length, 'Accept-Ranges': 'bytes' }); res.end(data) }
    return
  }
  if (req.method !== 'GET') return json({ tracked: true, fixture: true })
  if (p.endsWith('/storefront/studio')) return json(studio)
  if (p.endsWith('/storefront/config')) return json({ name: 'Savage Rise · recette locale', slug: 'fixture', status: 'active', country_code: 'TN', default_currency: 'TND', timezone: 'Africa/Tunis', locale: 'fr-TN', domain: 'fixture.local', public_url: 'https://fixture.local/', store_id: 's_1234567890abcdef', frontend_type: 'custom', configuration_source: 'platform', store_domain_revision: 1, store_open: true, feature_flags: { reviews: false, packs: false, wishlist: false } })
  if (p.endsWith('/catalog/products')) {
    const items = url.searchParams.get('product_kind') === 'bundle' ? [] : products
    return json({ items: items.map(({ variants, ...product }) => ({ ...product, primary_image: variants[0]?.media[1] })), total: items.length, page: 1, pages: 1, page_size: 20 })
  }
  if (p.includes('/catalog/products/')) return json(products.find(product => p.endsWith('/' + product.slug)) ?? { detail: 'Unknown fixture' })
  if (p.endsWith('/catalog/categories')) return json([])
  if (p.endsWith('/storefront/navigation')) return json({ menus: [] })
  if (p.endsWith('/storefront/drop-countdown')) return json({ is_active: false })
  return json({ detail: 'Fixture route absent' }, 404)
}).listen(49171, '127.0.0.1', () => console.log('Local fixture: ' + origin))
