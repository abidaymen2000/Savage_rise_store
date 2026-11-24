import {chromium,expect as playwrightExpect} from '../../.tmp/qa/node_modules/@playwright/test/index.mjs'
import {mkdir,readFile,writeFile} from 'node:fs/promises'
const expect=playwrightExpect.configure({timeout:30000})
const base='http://127.0.0.1:49176',fixture='http://127.0.0.1:49175',out='artifacts/hero-navigation-performance/evidence/functional'
await mkdir(out,{recursive:true})
const list=JSON.parse(await readFile('artifacts/black-performance/evidence/public/products.json','utf8')).items
const document=JSON.parse(await readFile('artifacts/black-performance/evidence/public/studio.json','utf8'))
const selected=list.find(p=>p.id===document.studio.hero.primary_action.product_id),other=list.find(p=>p.product_kind==='physical'&&p.id!==selected.id)
const path=p=>'/products/'+p.slug
const state=body=>fetch(fixture+'/__test/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
const reset=async()=>{await fetch(fixture+'/__test/reset',{method:'POST'});await state({compact:true,pageSize:100})}
await reset()
for(const p of ['/', '/products',path(selected),path(other),'/products/'+selected.id,'/checkout']){const r=await fetch(base+p);await r.arrayBuffer();if(!r.ok)throw Error(`${p}: ${r.status}`)}
const browser=await chromium.launch({channel:'chrome',headless:true}),checks=[],errors=[]
let page,context
async function session(width=1440){
 if(context)await context.close()
 context=await browser.newContext({viewport:{width,height:width<768?844:1000},reducedMotion:'reduce',colorScheme:'light'})
 await context.addInitScript(()=>{sessionStorage.setItem('savage_rise_visited','true');localStorage.setItem('theme','light')})
 await context.route('**/*',r=>{const q=r.request(),u=new URL(q.url());return u.hostname==='127.0.0.1'||['GET','HEAD'].includes(q.method())&&u.hostname==='ik.imagekit.io'?r.continue():r.abort()})
 page=await context.newPage();page.on('pageerror',e=>errors.push({message:e.message,stack:e.stack}));page.setDefaultTimeout(30000)
}
const go=async p=>{await page.goto(base+p,{waitUntil:'domcontentloaded',timeout:120000});await page.locator('[data-studio-hydrated="true"]').waitFor()}
async function check(name,fn){try{await fn();checks.push({name,status:'PASS'});console.log('PASS '+name)}catch(e){checks.push({name,status:'FAIL',error:e.message});await page.screenshot({path:out+'/failure.png'});throw e}finally{await writeFile(out+'/checks.json',JSON.stringify({checks,errors},null,2))}}
try{
 for(const width of [320,375,390,768,1440]){
  await session(width)
  await check(`Hero dynamic product link and premium PDP at ${width}px`,async()=>{
   await go('/');const cta=page.locator('.store-hero').getByRole('link',{name:'Shop Now',exact:true})
   await expect(cta).toHaveAttribute('href','/products/'+selected.id)
   await page.screenshot({path:out+`/hero-${width}.png`})
   let dialogs=0;await page.evaluate(()=>{window.__heroDialog=false;window.__heroObserver=new MutationObserver(()=>{if(document.querySelector('[role="dialog"]'))window.__heroDialog=true});window.__heroObserver.observe(document.body,{childList:true,subtree:true})})
   const index=(await(await fetch(fixture+'/__test/metrics')).json()).length
   const navigationReads=[],browserProductReads=[]
   const observe=request=>{const url=new URL(request.url());if(url.searchParams.has('_rsc'))navigationReads.push({path:url.pathname,prefetch:request.headers()['next-router-prefetch']});if(url.pathname.startsWith('/api/core/catalog/products/'))browserProductReads.push(url.pathname)}
   page.on('request',observe)
   await cta.click();await expect(page).toHaveURL(base+path(selected));await expect(page.locator('.store-add-button')).toBeEnabled()
   page.off('request',observe)
   dialogs=await page.evaluate(()=>{window.__heroObserver.disconnect();return window.__heroDialog})
   expect(dialogs).toBe(false);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false)
   const calls=(await(await fetch(fixture+'/__test/metrics')).json()).slice(index).filter(c=>c.method==='GET'&&c.path.startsWith('/catalog/products/'))
   // Next 14 development navigation can fetch a partial prefetch then the leaf.
   // There must be no browser product lookup and no fetch to canonicalize the URL.
   expect(browserProductReads).toHaveLength(0)
   expect(navigationReads.every(r=>r.path==='/products/'+selected.id)).toBe(true)
   expect(calls.filter(c=>c.path.endsWith(selected.id)||c.path.endsWith(selected.slug)).length).toBeLessThanOrEqual(navigationReads.length)
   expect(navigationReads.length).toBeLessThanOrEqual(2)
   await page.screenshot({path:out+`/product-${width}.png`})
   await page.getByRole('link',{name:'Back to Shop',exact:true}).click();await expect(page.locator('.store-catalog .store-product-card')).toHaveCount(list.filter(p=>p.product_kind==='physical').length)
  })
 }
 await check('Studio fixture changes the Hero target without any hardcoded slug',async()=>{
  await state({hero:{primary_action:{type:'buy_product',product_id:other.id}}});await go('/')
  await page.locator('.store-hero').getByRole('link',{name:'Shop Now',exact:true}).click()
  await expect(page).toHaveURL(base+path(other));await expect(page.locator('.store-product-detail h1')).toHaveText(other.name)
  await reset()
 })
 await check('Product ID alias, canonical URL, refresh, query/hash and Back/Forward',async()=>{
  await go('/products');await go('/products/'+selected.id+'?fixture=1#details')
  await expect(page).toHaveURL(base+path(selected)+'?fixture=1#details')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',new RegExp(path(selected)+'$'))
  await page.reload();await expect(page.locator('.store-add-button')).toBeEnabled()
  await page.goBack();await expect(page.locator('.store-catalog .store-product-card')).toHaveCount(5)
  await page.goForward();await expect(page).toHaveURL(base+path(selected)+'?fixture=1#details');await expect(page.locator('.store-add-button')).toBeEnabled()
 })
 await check('Quick Add on cards and Buy Now on PDP still preserve the bag',async()=>{
  await go('/products');const card=page.locator('.store-product-card').filter({has:page.locator(`a[href="${path(selected)}"]`)}).first()
  await card.getByRole('button',{name:'Quick Add to Bag',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('dialog')).toContainText(selected.name);await page.keyboard.press('Escape')
  await card.locator(`a[href="${path(selected)}"]`).first().click();await page.locator('.store-buy-button').click();await expect(page).toHaveURL(/\/checkout\?buy=/)
  await expect(page.getByRole('heading',{name:'Checkout',exact:true})).toBeVisible()
 })
 await check('Sold-out product remains viewable from Hero and cannot be ordered',async()=>{
  await state({soldOut:true});await go('/');await page.locator('.store-hero').getByRole('link',{name:'Shop Now',exact:true}).click();await expect(page).toHaveURL(base+path(selected));await expect(page.locator('.store-add-button')).toBeDisabled();await expect(page.getByRole('dialog')).toHaveCount(0);await reset()
 })
 await check('New catalogue request observes current prices and all categories',async()=>{
  await state({price:97.5});await go(path(selected));await expect(page.locator('.store-detail-price')).toContainText('97,500');await go('/products')
  await expect(page.locator('.store-product-card')).toHaveCount(5)
  await page.getByRole('combobox',{name:'Category',exact:true}).click();await expect(page.getByRole('option',{name:'Hoodies',exact:true})).toBeVisible();await page.keyboard.press('Escape');await reset()
 })
 expect(errors).toHaveLength(0)
}finally{await context?.close();await browser.close();await reset();await writeFile(out+'/checks.json',JSON.stringify({checks,errors},null,2))}
