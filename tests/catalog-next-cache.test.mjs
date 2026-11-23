import test from 'node:test'
import assert from 'node:assert/strict'
import {AsyncLocalStorage} from 'node:async_hooks'
import {readFileSync} from 'node:fs'
import {patchFetch} from 'next/dist/server/lib/patch-fetch.js'
import {DynamicServerError} from 'next/dist/client/components/hooks-server-context.js'

test('installed Next 14 reproduces stale partial RSC data; catalogue policy reads current tenant data',async()=>{
 const original=globalThis.fetch,storage=new AsyncLocalStorage(),entries=new Map()
 let currentTotal=4,originReads=0
 const cache={fetchCacheKey:async(url,init)=>JSON.stringify([url,[...new Headers(init.headers)]]),lock:async()=>async()=>{},get:async key=>entries.has(key)?{value:entries.get(key),isStale:false}:null,set:async(key,value)=>entries.set(key,value)}
 globalThis.fetch=async()=>{originReads++;return new Response(JSON.stringify({total:currentTotal}),{headers:{'Content-Type':'application/json','Cache-Control':'private, no-store'}})}
 patchFetch({staticGenerationAsyncStorage:storage,serverHooks:{DynamicServerError}})
 const read=(policy,tenant='savagerise.com')=>storage.run({forceDynamic:true,isStaticGeneration:false,pagePath:'/products/page',urlPathname:'/products',incrementalCache:cache,...policy},async()=>{
  return (await fetch('https://catalog.example.invalid/catalog/products',{headers:{'X-Store-Domain':tenant},signal:new AbortController().signal})).json()
 })
 try{
  assert.equal((await read({})).total,4)
  currentTotal=5
  assert.equal((await read({})).total,4,'force-dynamic alone still reads the old Data Cache in the installed version')
  assert.equal(originReads,1)
  assert.equal((await read({revalidate:0})).total,5,'full layout uncached read bypasses the cached list')
  assert.equal((await read({fetchCache:'default-no-store'})).total,5)
  assert.equal(originReads,3)
  assert.equal((await read({},'another.example.invalid')).total,5,'tenant headers participate in the existing cache key')
  for(const source of ['app/products/page.tsx','app/categories/[name]/page.tsx','app/page.tsx'])assert.match(readFileSync(source,'utf8'),/export const fetchCache = "default-no-store"/)
 }finally{globalThis.fetch=original}
})
