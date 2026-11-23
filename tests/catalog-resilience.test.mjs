import test from 'node:test'
import assert from 'node:assert/strict'
import {loadCatalogProducts} from '@/lib/storefront/catalog-data'
import {loadCatalogCategories} from '@/lib/storefront/catalog-categories'
import {CatalogIntegrityError,readCatalog} from '@/lib/catalog-read'
import {catalogApi} from '@/lib/api/catalog-api'
import {CatalogService} from '@/lib/api/api-client'
import {createCatalogDiagnostics} from '@/lib/storefront/catalog-diagnostics'

const product=id=>({id,slug:id,name:id,product_kind:'physical',price:89.9,variants:[],category_ids:['hoodies']})
const page=(items,total=items.length,size=100,number=1)=>({items,total,page:number,page_size:size,pages:Math.ceil(total/size),has_next:number*size<total,has_prev:number>1})

for(const [name,mutate] of [
 ['short final page',p=>({...p,items:p.items.slice(1)})],
 ['missing items',p=>({...p,items:undefined})],
 ['invalid total',p=>({...p,total:NaN})],
 ['negative total',p=>({...p,total:-1})],
 ['noninteger page size',p=>({...p,page_size:1.5})],
 ['inconsistent pages',p=>({...p,pages:2})],
 ['inconsistent has_next',p=>({...p,has_next:true})],
 ['inconsistent has_prev',p=>({...p,has_prev:true})],
 ['wrong page',p=>({...p,page:2})],
 ['duplicate ids',p=>({...p,items:[p.items[0],p.items[0]]})],
 ['missing id',p=>({...p,items:[{},p.items[1]]})],
])test(`catalog rejects HTTP 200 with ${name}`,async()=>{
 await assert.rejects(()=>loadCatalogProducts(async()=>mutate(page([product('a'),product('b')]))),CatalogIntegrityError)
})

test('catalog verifies every page and unique total above 24, retaining the final product',async()=>{
 const source=Array.from({length:53},(_,n)=>product('product-'+n)),calls=[]
 const result=await loadCatalogProducts(async(skip,limit)=>{calls.push({skip,limit});return page(source.slice(skip,skip+7),source.length,7,skip/7+1)})
 assert.deepEqual(result,source);assert.equal(new Set(result.map(p=>p.id)).size,53);assert.equal(calls.length,8)
 assert.equal(calls[0].limit,100);assert.ok(calls.slice(1).every(c=>c.limit===7))
})

for(const mode of ['total changes','page size changes','repeated final page','overlapping ids','page failure'])test(`catalog never returns a partial collection when ${mode}`,async()=>{
 await assert.rejects(()=>loadCatalogProducts(async(skip)=>{
  if(!skip)return page([product('a'),product('b')],4,2,1)
  if(mode==='page failure')throw Object.assign(Error('offline'),{status:503})
  if(mode==='total changes')return page([product('c')],3,2,2)
  if(mode==='page size changes')return page([product('b')],4,1,2)
  if(mode==='repeated final page')return page([product('a'),product('b')],4,2,1)
  return page([product('b'),product('c')],4,2,2)
 }))
})

test('confirmed empty catalog and unavailable categories are distinct states',async()=>{
 assert.deepEqual(await loadCatalogProducts(async()=>page([])),[])
 assert.deepEqual(await loadCatalogCategories(async()=>[]),{available:true,items:[]})
 assert.deepEqual(await loadCatalogCategories(async()=>{throw Error('timeout')}),{available:false,items:[]})
})

test('temporary catalog reads recover within two attempts; permanent rejection is not retried',async()=>{
 let calls=0;const events=[]
 const value=await readCatalog(async()=>{if(++calls===1)throw Object.assign(Error('upstream'),{status:503});return 5},{observer:e=>events.push(e),wait:async()=>{}})
 assert.equal(value,5);assert.equal(calls,2);assert.deepEqual(events.map(e=>e.status),[503,200])
 for(const status of [400,401,403,404]){calls=0;await assert.rejects(()=>readCatalog(async()=>{calls++;throw Object.assign(Error('permanent'),{status})},{wait:async()=>{}}));assert.equal(calls,1)}
})

test('suspended SDK reads are cancelled and cannot block indefinitely',async()=>{
 let cancelled=0,calls=0
 await assert.rejects(()=>readCatalog(()=>{calls++;return Object.assign(new Promise(()=>{}),{cancel:()=>{cancelled++}})},{timeoutMs:10,wait:async()=>{}}),e=>e.status===408)
 assert.equal(cancelled,2);assert.equal(calls,2)
})

test('malformed successful read can recover; persistent failure remains bounded',async()=>{
 let calls=0
 assert.equal(await readCatalog(async()=>++calls,{validate:n=>{if(n===1)throw new CatalogIntegrityError('incomplete_page')},wait:async()=>{}}),2)
 calls=0;await assert.rejects(()=>readCatalog(async()=>{calls++;throw Error('offline')},{wait:async()=>{}}));assert.equal(calls,2)
})

test('detail failure never becomes zero price, lost variants, or reduced category membership',async()=>{
 const originals={list:CatalogService.listProductsCatalogProductsGet,detail:catalogApi.getProduct}
 const events=[]
 CatalogService.listProductsCatalogProductsGet=async()=>page([{...product('a'),min_price:89.9,status:'active'}])
 catalogApi.getProduct=async()=>{throw Object.assign(Error('detail failed'),{status:503})}
 try{await assert.rejects(()=>catalogApi.getProductsPage(0,100,{},e=>events.push(e)));assert.deepEqual(events.find(e=>e.missingIds)?.missingIds,['a'])}
 finally{CatalogService.listProductsCatalogProductsGet=originals.list;catalogApi.getProduct=originals.detail}
})

for(const mismatch of ['id','product_kind'])test(`a detail ${mismatch} mismatch fails before storefront filtering`,async()=>{
 const originals={list:CatalogService.listProductsCatalogProductsGet,detail:catalogApi.getProduct}
 CatalogService.listProductsCatalogProductsGet=async()=>page([product('a')]);catalogApi.getProduct=async()=>({...product('a'),[mismatch]:'unexpected'})
 try{await assert.rejects(()=>catalogApi.getProductsPage(),e=>e.reason==='detail_identity_mismatch')}
 finally{CatalogService.listProductsCatalogProductsGet=originals.list;catalogApi.getProduct=originals.detail}
})

test('a physical detail without an authoritative price fails; a real zero remains unchanged',async()=>{
 const original=CatalogService.getProductCatalogProductsSlugGet
 CatalogService.getProductCatalogProductsSlugGet=async()=>product('a')
 try{
  await assert.rejects(()=>catalogApi.getProduct('a'),e=>e.reason==='missing_product_price')
  CatalogService.getProductCatalogProductsSlugGet=async()=>({...product('a'),attribute_values:{price:0}})
  assert.equal((await catalogApi.getProduct('a')).price,0)
 }finally{CatalogService.getProductCatalogProductsSlugGet=original}
})

test('concurrent loads have independent products, counters and diagnostics; normal operation is quiet',async()=>{
 const results=await Promise.all(['tenant-a','tenant-b'].map(prefix=>loadCatalogProducts(async skip=>page([product(prefix+skip)],2,1,skip+1))))
 assert.deepEqual(results.map(ps=>ps.map(p=>p.id)),[['tenant-a0','tenant-a1'],['tenant-b0','tenant-b1']])
 const original=console.warn,info=console.info,lines=[],previous=process.env.CATALOG_DIAGNOSTICS
 console.warn=console.info=s=>lines.push(JSON.parse(s));delete process.env.CATALOG_DIAGNOSTICS
 try{
  createCatalogDiagnostics('/products').finish({outcome:'complete',loaded:5,categoriesAvailable:true});assert.equal(lines.length,0)
  const a=createCatalogDiagnostics('/products'),b=createCatalogDiagnostics('/products')
  a.observe({operation:'page',page:1,total:5,loaded:4});a.observe({operation:'integrity',reason:'detail_unavailable',missingIds:['a']})
  b.observe({operation:'integrity',reason:'request_failed'})
  a.finish({outcome:'unavailable',loaded:0,categoriesAvailable:true});b.finish({outcome:'complete',loaded:5,categoriesAvailable:false})
  assert.notEqual(lines[0].requestId,lines[1].requestId);assert.equal(lines[0].announcedTotal,5);assert.deepEqual(lines[1].missingIds,[])
  assert.equal(lines[1].fallback,'unfiltered_catalog');assert.equal(lines[0].tenant,'savagerise.com')
 }finally{console.warn=original;console.info=info;if(previous===undefined)delete process.env.CATALOG_DIAGNOSTICS;else process.env.CATALOG_DIAGNOSTICS=previous}
})
