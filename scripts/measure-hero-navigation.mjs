// Deterministic API delay and public snapshot replay; all writes stay local.
import {chromium,expect as playwrightExpect} from '../.tmp/qa/node_modules/@playwright/test/index.mjs'
const expect=playwrightExpect.configure({timeout:30000})
import {mkdir,writeFile,readFile} from 'node:fs/promises'
const stage=process.env.HERO_PERF_STAGE||'after',base='http://127.0.0.1:49176',fixture='http://127.0.0.1:49175'
const out=`artifacts/hero-navigation-performance/evidence/${stage}-browser`
await mkdir(out,{recursive:true})
const list=JSON.parse(await readFile('artifacts/black-performance/evidence/public/products.json','utf8')).items
const doc=JSON.parse(await readFile('artifacts/black-performance/evidence/public/studio.json','utf8'))
const selected=list.find(p=>p.id===doc.studio.hero.primary_action.product_id)
const path='/products/'+selected.slug
await fetch(fixture+'/__test/reset',{method:'POST'})
await fetch(fixture+'/__test/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({compact:true,pageSize:100,delayMs:1000})})
for(const p of ['/', '/products',path,'/products/'+selected.id]){const r=await fetch(base+p);await r.arrayBuffer();if(!r.ok)throw Error(`${p}: ${r.status}`)}
const browser=await chromium.launch({channel:'chrome',headless:true}),rows=[],errors=[]
try{for(const profile of ['desktop','instagram-simulated']){
 const mobile=profile!=='desktop'
 const context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce',...(mobile?{userAgent:'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 Instagram 359.0.0.0.0 Android'}:{})})
 await context.addInitScript(()=>{sessionStorage.setItem('savage_rise_visited','true');localStorage.setItem('theme','light')})
 const page=await context.newPage(),cdp=await context.newCDPSession(page)
 await cdp.send('Network.enable')
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:mobile?4:1})
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:mobile?150:0,downloadThroughput:mobile?8_000_000/8:-1,uploadThroughput:mobile?1_000_000/8:-1})
 await cdp.send('Fetch.enable',{patterns:[{urlPattern:'*',requestStage:'Request'}]})
 cdp.on('Fetch.requestPaused',async e=>{try{const local=new URL(e.request.url).hostname==='127.0.0.1';await cdp.send(!local&&!['GET','HEAD'].includes(e.request.method)?'Fetch.failRequest':'Fetch.continueRequest',!local&&!['GET','HEAD'].includes(e.request.method)?{requestId:e.requestId,errorReason:'Aborted'}:{requestId:e.requestId})}catch{}})
 page.on('pageerror',e=>errors.push({profile,message:e.message,stack:e.stack}))
 page.setDefaultTimeout(30000)
 const ready=()=>page.locator('[data-studio-hydrated="true"]').waitFor({timeout:120000})
 const go=async p=>{await page.goto(base+p,{waitUntil:'domcontentloaded',timeout:120000});await ready()}
 // Compile and hydrate both routes before timed navigation. No RSC prefetch forced.
 await go(path);await go('/products');await go('/')
 let active
 page.on('response',async r=>{if(!active)return;const entry=active,u=new URL(r.url());if(u.searchParams.has('_rsc')){const timing=r.request().timing();entry.rsc.push({path:u.pathname,status:r.status(),ttfbMs:timing.responseStart-timing.requestStart})}})
 async function measure(name,action,settled){
  const index=(await(await fetch(fixture+'/__test/metrics')).json()).length,start=performance.now()
  const row={profile,name,sample:activeSample,rsc:[]};active=row
  await action();await settled();row.usableMs=performance.now()-start;row.url=page.url()
  row.calls=(await(await fetch(fixture+'/__test/metrics')).json()).slice(index);row.apiCount=row.calls.length
  row.overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)
  rows.push(row);active=null;await writeFile(out+'/measurements.json',JSON.stringify({stage,conditions:'Same snapshots; 1000ms/catalogue request; warmed Next dev; mobile: Instagram UA, 390px, 4x CPU, 8Mbps/150ms. Not actual Instagram.',rows,errors},null,2));console.log(JSON.stringify({...row,calls:undefined}));return row
 }
 let activeSample
 for(activeSample=1;activeSample<=3;activeSample++){
  await go('/')
  await measure('hero-shop-now',()=>page.locator('.store-hero').getByRole(stage==='before'?'button':'link',{name:'Shop Now',exact:true}).click(),async()=>{
   if(stage==='before')await expect(page.getByRole('dialog')).toBeVisible()
   else {await expect(page).toHaveURL(base+path);await expect(page.locator('.store-add-button')).toBeEnabled()}
  })
  if(stage==='before')await page.keyboard.press('Escape')
  await go('/')
  await measure('home-shop',async()=>{
   let link=page.locator('.store-header a[href="/products"]').filter({visible:true}).first()
   if(!await link.count()){await page.getByRole('button',{name:/Open menu|Toggle menu/i}).click();link=page.locator('a[href="/products"]').filter({visible:true}).first()}
   await link.click()
  },()=>expect(page.locator('.store-catalog .store-product-card')).toHaveCount(list.filter(p=>p.product_kind==='physical').length))
  await measure('shop-product',()=>page.locator(`.store-product-card a[href="${path}"]`).first().click(),async()=>{await expect(page.locator('.store-add-button')).toBeEnabled();await page.getByRole('button',{name:'Color Black',exact:true}).click();await page.locator('.store-size-button').filter({hasText:/^XL$/}).click();await expect(page.locator('.store-size-button').filter({hasText:/^XL$/})).toHaveAttribute('aria-pressed','true')})
  await measure('product-shop',()=>page.getByRole('link',{name:'Back to Shop',exact:true}).click(),()=>expect(page.locator('.store-catalog .store-product-card')).toHaveCount(list.filter(p=>p.product_kind==='physical').length))
 }
 await page.screenshot({path:out+'/'+profile+'.png'});await context.close()
}}finally{await browser.close()}
if(errors.length)throw Error(JSON.stringify(errors))
