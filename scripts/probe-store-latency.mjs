// Public GETs only. No authentication, telemetry, orders or data mutations.
import {mkdir,writeFile} from 'node:fs/promises'
const out='artifacts/hero-navigation-performance/evidence'
const api='https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com/api/core'
await mkdir(out+'/public',{recursive:true})
const results=[]
async function read(name,path,sample=1,store=false){
 const start=performance.now()
 const response=await fetch((store?'https://www.savagerise.com':api)+path,{headers:{'X-Store-Domain':'savagerise.com',Origin:'https://savagerise.com'},signal:AbortSignal.timeout(60000)})
 const ttfb=performance.now()-start,body=await response.text()
 const row={name,path,sample,status:response.status,ttfbMs:ttfb,totalMs:performance.now()-start,bytes:Buffer.byteLength(body),headers:Object.fromEntries([...response.headers].filter(([k])=>/^(cache-control|age|vary|date|server|server-timing|x-request-id|x-vercel-cache|x-vercel-id)$/.test(k)))}
 results.push(row);await writeFile(out+'/public-latency.json',JSON.stringify({getOnly:true,at:new Date().toISOString(),results},null,2));console.log(JSON.stringify(row))
 if(!response.ok)throw Error(`${name}: ${response.status}`)
 if(!store){await writeFile(out+'/public/'+name+'.json',body);return JSON.parse(body)}
}
await read('config','/storefront/config')
const studio=await read('studio','/storefront/studio')
const list=await read('products','/catalog/products?page=1&page_size=100')
await read('vlog','/storefront/vlog')
for(const product of list.items)await read('product-'+product.slug,'/catalog/products/'+encodeURIComponent(product.slug))
const id=studio.studio.hero.primary_action?.product_id
const selected=list.items.find(p=>p.id===id)||list.items[0]
for(let sample=1;sample<=3;sample++){
 await read('categories','/catalog/categories',sample)
 await read('summary','/catalog/products?page=1&page_size=100&include=variant_summary',sample)
 await read('selected','/catalog/products/'+encodeURIComponent(selected.slug),sample)
 await read('shop','/products',sample,true)
 await read('pdp','/products/'+encodeURIComponent(selected.slug),sample,true)
}
