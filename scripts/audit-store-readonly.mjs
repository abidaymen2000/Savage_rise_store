// Public GET-only evidence. Never authenticates or changes remote data.
import { mkdir, writeFile } from 'node:fs/promises'
const out = new URL('../artifacts/store-redesign/before/', import.meta.url)
await mkdir(out, {recursive:true})
const base = 'https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com/api/core'
const endpoints = {
  home: 'https://www.savagerise.com/', shop: 'https://www.savagerise.com/products',
  config: base+'/storefront/config', studio: base+'/storefront/studio',
  categories: base+'/catalog/categories', products: base+'/catalog/products?page=1&page_size=100',
  physical: base+'/catalog/products?page=1&page_size=100&product_kind=physical',
}
const results = await Promise.all(Object.entries(endpoints).map(async ([name,url]) => {
  try {
    const response = await fetch(url, {headers: {'X-Store-Domain':'savagerise.com', Origin:'https://savagerise.com'}, signal:AbortSignal.timeout(30000)})
    const body=await response.text()
    await writeFile(new URL(name+(name==='home'||name==='shop'?'.html':'.json'),out),body)
    let data; try {data=JSON.parse(body)} catch {}
    return {name,url,status:response.status,bytes:body.length,summary: data?.items?.map(p=>({id:p.id,slug:p.slug,name:p.name,kind:p.product_kind,status:p.status,category:p.primary_category_id})), total:data?.total,pages:data?.pages,error:data?.detail}
  } catch (error) {return {name,url,error:error.message}}
}))
await writeFile(new URL('audit.json',out),JSON.stringify({at:new Date().toISOString(),results},null,2))
console.log(JSON.stringify(results,null,2))
const products=results.find(r=>r.name==='products')?.summary ?? []
for (const item of products) {
  const response=await fetch(base+'/catalog/products/'+encodeURIComponent(item.slug),{headers:{'X-Store-Domain':'savagerise.com',Origin:'https://savagerise.com'},signal:AbortSignal.timeout(20000)})
  if (response.ok) await writeFile(new URL('product-'+item.slug+'.json',out),await response.text())
}
