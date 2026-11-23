// Requires the isolated, authorized development server and local snapshot fixture.
// No external writes, no test-runner retries, no production server startup.
import {chromium,expect as pwExpect} from '../.tmp/qa/node_modules/@playwright/test/index.mjs'
import {readFile,writeFile,mkdir} from 'node:fs/promises'
const expect=pwExpect.configure({timeout:15000})
const base=process.env.CATALOG_TEST_BASE||'http://127.0.0.1:49176',fixture=process.env.CATALOG_TEST_API||'http://127.0.0.1:49175'
const out='artifacts/catalog-resilience/evidence'
const raw=JSON.parse(await readFile(out+'/public/physical.json','utf8')),expected=raw.items.map(p=>p.slug).sort()
const report={started:new Date().toISOString(),base,checks:[],stable:[],errors:[],blockedExternalWrites:[],responsive:[]}
const state=async body=>{const r=await fetch(fixture+'/__test/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw Error('Fixture state unavailable')}
const reset=()=>fetch(fixture+'/__test/reset',{method:'POST'})
const save=()=>writeFile(out+'/browser-final.json',JSON.stringify(report,null,2))
await mkdir(out,{recursive:true});await reset()
for(const path of ['/','/products','/products/sr-ombra-oversized-hoodie','/categories/hoodies','/checkout','/checkout/success']){const r=await fetch(base+path);if(!r.ok)throw Error('Warmup '+path+' '+r.status);await r.arrayBuffer()}
const browser=await chromium.launch({channel:'chrome',headless:true})
let context,page
async function newSession(width=1440,images=false){
 const c=await browser.newContext({viewport:{width,height:width<768?844:1000},reducedMotion:'reduce',colorScheme:'light'})
 await c.addInitScript(()=>{if(location.hostname==='127.0.0.1'||location.hostname==='localhost')localStorage.setItem('theme','light')})
 await c.route('**/*',r=>{
  const q=r.request(),u=new URL(q.url())
  if(['127.0.0.1','localhost'].includes(u.hostname))return r.continue()
  if(images&&u.hostname==='ik.imagekit.io'&&['GET','HEAD'].includes(q.method()))return r.continue()
  if(!['GET','HEAD'].includes(q.method()))report.blockedExternalWrites.push({method:q.method(),host:u.hostname,path:u.pathname})
  return r.abort()
 })
 c.on('page',p=>p.on('pageerror',e=>report.errors.push({url:p.url(),message:e.message})))
 return c
}
async function go(path,p=page){const r=await p.goto(base+path,{waitUntil:'domcontentloaded',timeout:90000});await p.locator('[data-studio-hydrated="true"]').waitFor({state:'attached',timeout:30000});return r}
async function ready(p=page){await p.locator('.store-catalog').waitFor();await expect(p.locator('.store-catalog .store-product-card').first().or(p.getByText('No products found.',{exact:true})).or(p.getByText('The collection could not be loaded.',{exact:true}))).toBeVisible()}
const slugs=(p=page)=>p.locator('.store-product-card a').evaluateAll(links=>[...new Set(links.map(a=>a.getAttribute('href')?.split('/').at(-1)).filter(Boolean))].sort())
async function categories(p=page){await p.getByRole('combobox',{name:'Category',exact:true}).click();await expect(p.getByRole('option').first()).toBeVisible();const names=await p.getByRole('option').allTextContents();await p.keyboard.press('Escape');return names}
async function check(name,fn){const start=performance.now();try{const evidence=await fn();report.checks.push({name,status:'PASS',ms:performance.now()-start,evidence});console.log('PASS '+name)}catch(e){report.checks.push({name,status:'FAIL',error:e.message,ms:performance.now()-start});console.error('FAIL '+name+' '+e.message);process.exitCode=1;await page.screenshot({path:out+'/failure-'+report.checks.length+'.png'}).catch(()=>{})}await save()}
try{
 context=await newSession();page=await context.newPage()
 await check('50 stable loads: direct, refresh, home navigation, product return, private/new session',async()=>{
  const modes=['direct','refresh','home-to-shop','product-to-shop','private-session']
  for(let n=0;n<50;n++){
   const mode=modes[n%5],start=performance.now(),errorsBefore=report.errors.length
   if(mode==='private-session'){await context.close();context=await newSession();page=await context.newPage()}
   let response
   if(mode==='refresh')response=await page.reload({waitUntil:'domcontentloaded',timeout:60000})
   else if(mode==='home-to-shop'){await go('/');await page.locator('[data-store-entrance-pending="false"]').waitFor({state:'attached'});await page.locator('.store-header a[href="/products"]').first().click();await page.waitForURL(base+'/products')}
   else if(mode==='product-to-shop'){await go('/products/'+raw.items[0].slug);await page.locator('[data-store-entrance-pending="false"]').waitFor({state:'attached'});await page.getByRole('link',{name:'Back to Shop',exact:true}).click();await page.waitForURL(base+'/products')}
   else response=await go('/products')
   await page.locator('[data-studio-hydrated="true"]').waitFor({state:'attached',timeout:30000})
   await ready();await expect(page.locator('.store-product-card')).toHaveCount(expected.length)
   const found=await slugs(),options=await categories(),counter=await page.locator('.store-catalog header p').innerText()
   expect(found).toEqual(expected);expect(options).toContain('Hoodies');expect(counter).toBe('5 products');expect(report.errors.length).toBe(errorsBefore)
   let ssr
   if(response){const html=await response.text();ssr=[...html.matchAll(/<article class="store-product-card[\s\S]*?<a[^>]*href="\/products\/([^"?]+)/g)].map(m=>m[1]).sort();expect(ssr).toEqual(expected)}
   report.stable.push({iteration:n+1,mode,status:'PASS',slugs:found,options,counter,ssr,ms:performance.now()-start});await save();console.log('STABLE '+(n+1)+'/50 '+mode)
  }
 })
 for(const fault of ['list-once','categories-once','detail-once'])await check('transient recovery: '+fault,async()=>{
  await reset();await state({fault});await go('/products');await ready();expect(await slugs()).toEqual(expected);expect(await categories()).toContain('Hoodies')
  return {records:await(await fetch(fixture+'/__test/records')).json()}
 })
 for(const fault of ['categories-503','categories-timeout'])await check('isolated category outage: '+fault,async()=>{
  await reset();await state({fault});const start=performance.now();await go('/products?category=hoodies');await ready();expect(await slugs()).toEqual(expected)
  await expect(page.getByText('Categories are temporarily unavailable.',{exact:true})).toBeVisible();await expect(page.getByRole('combobox',{name:'Category',exact:true})).toBeDisabled()
  expect(performance.now()-start).toBeLessThan(35000)
  const filename=out+'/'+fault+'-1440.png';await page.screenshot({path:filename})
  await reset();await page.getByRole('button',{name:'Try Again',exact:true}).click();await expect(page.locator('.store-product-card')).toHaveCount(1,{timeout:30000});await expect(page.locator('.store-product-name')).toContainText('OMBRA')
  return {recovered:true,screenshot:filename}
 })
 for(const fault of ['detail-503','detail-timeout','detail-corrupt','page-503','short-200','missing-items','total-change','repeat-final','kind-mismatch'])await check('no false complete catalogue: '+fault,async()=>{
  await reset();await state({fault});const start=performance.now();await go('/products');await ready()
  await expect(page.getByText('The collection could not be loaded.',{exact:true})).toBeVisible();await expect(page.locator('.store-product-card')).toHaveCount(0)
  expect(await page.locator('main').innerText()).not.toMatch(/\b\d+ products|No products found|0,000/);expect(performance.now()-start).toBeLessThan(35000)
  const records=await(await fetch(fixture+'/__test/records')).json()
  await reset();await page.getByRole('button',{name:'Try Again',exact:true}).click();await expect(page.locator('.store-product-card')).toHaveCount(expected.length,{timeout:30000})
  return {recovered:true,records}
 })
 await check('slow Core reads and true empty results remain distinct',async()=>{
  await reset();await state({delayMs:250});await go('/products');await ready();expect(await slugs()).toEqual(expected)
  await reset();await state({empty:true});await go('/products');await ready();await expect(page.getByText('No products found.',{exact:true})).toBeVisible();await expect(page.locator('.store-catalog header p')).toHaveText('0 products')
 })
 await check('30 products: full API traversal, 24 + 6 UI pagination, no duplicates',async()=>{
  await reset();await state({count:30,pageSize:7});await go('/products');await ready();await expect(page.locator('.store-product-card')).toHaveCount(24);await expect(page.locator('.store-catalog header p')).toHaveText('30 products');const first=await slugs()
  await page.getByRole('link',{name:'Next',exact:true}).click();await expect(page.locator('.store-product-card')).toHaveCount(6);const second=await slugs();expect(new Set([...first,...second]).size).toBe(30)
  await page.getByRole('link',{name:'Previous',exact:true}).click();await expect(page.locator('.store-product-card')).toHaveCount(24)
  return {first,second}
 })
 await check('OMBRA search, nested categories, all other products and genuine unknown category',async()=>{
  await reset()
  for(const item of raw.items){await go('/products?q='+encodeURIComponent(item.name));await ready();await expect(page.locator('.store-product-card')).toHaveCount(1);expect(await slugs()).toEqual([item.slug])}
  for(const [path,count] of [['/products?category=hoodies',1],['/categories/hoodies',1],['/products?category=clothing',5],['/products?category=pants',1],['/products?category=t-shirts',3],['/products?category=does-not-exist',0]]){await go(path);await ready();await expect(page.locator('.store-product-card')).toHaveCount(count)}
  await go('/');await expect(page.locator('.store-category-card').filter({hasText:'Hoodies'})).toBeVisible();await expect(page.locator('.store-product-name').filter({hasText:'OMBRA'}).first()).toBeVisible()
 })
 await check('SSR remains complete while hydration is delayed',async()=>{
  await reset();const c=await newSession(),p=await c.newPage();let release;const gate=new Promise(resolve=>release=resolve)
  await c.route('**/_next/**/*.js*',async r=>{await gate;await r.continue()})
  try{const response=await p.goto(base+'/products',{waitUntil:'commit',timeout:60000});const html=await response.text();expect(raw.items.every(item=>html.includes(item.slug))).toBe(true);await expect(p.locator('.store-product-card')).toHaveCount(5);const before=await slugs(p);release();await p.locator('[data-studio-hydrated="true"]').waitFor({state:'attached',timeout:30000});expect(await slugs(p)).toEqual(before);return {before,after:await slugs(p)}}finally{release();await c.close()}
 })
 await check('six concurrent catalogue requests stay complete and tenant-scoped',async()=>{
  await reset();const sessions=await Promise.all(Array.from({length:6},()=>newSession()))
  try{const found=await Promise.all(sessions.map(async c=>{const p=await c.newPage();await go('/products',p);await ready(p);return slugs(p)}));found.forEach(value=>expect(value).toEqual(expected));const records=await(await fetch(fixture+'/__test/records')).json();expect(records.every(r=>r.tenant==='savagerise.com')).toBe(true);return {sessions:found.length,tenants:[...new Set(records.map(r=>r.tenant))]}}finally{await Promise.all(sessions.map(c=>c.close()))}
 })
 for(const width of [320,375,390,768,1440])await check('responsive collection and category outage at '+width+'px',async()=>{
  await reset();await context.close();context=await newSession(width,true);page=await context.newPage();await go('/products');await ready();await expect(page.locator('.store-product-card')).toHaveCount(5)
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,lang:document.documentElement.lang}));expect(layout.scrollWidth).toBeLessThanOrEqual(width);expect(layout.lang).toBe('en')
  await page.screenshot({path:out+'/catalog-'+width+'.png',fullPage:true})
  await state({fault:'categories-503'});await go('/products?category=hoodies');await ready();await expect(page.locator('.store-product-card')).toHaveCount(5);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  await page.screenshot({path:out+'/categories-unavailable-'+width+'.png',fullPage:true});report.responsive.push({...layout,status:'PASS'})
 })
 await check('no JavaScript errors and no production writes',async()=>{expect(report.errors).toEqual([]);expect(report.blockedExternalWrites).toEqual([])})
}finally{await browser.close();await reset();report.finished=new Date().toISOString();await save()}
