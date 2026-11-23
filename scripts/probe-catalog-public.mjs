import {chromium} from '../.tmp/qa/node_modules/@playwright/test/index.mjs'
import {mkdir,writeFile,readFile} from 'node:fs/promises'
import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
const out=process.env.CATALOG_PROBE_OUTPUT||'artifacts/catalog-resilience/evidence/public-check'
const base='https://www.savagerise.com',api='https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com/api/core'
const tenantHeaders={'X-Store-Domain':'savagerise.com',Origin:'https://savagerise.com'}
const headers=r=>Object.fromEntries([...r.headers.entries()].filter(([k])=>/^(cache-control|age|etag|vary|date|last-modified|x-vercel.*|x-matched-path|server|via|x-cache.*|content-type|x-request-id)$/.test(k)))
const report={started:new Date().toISOString(),head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),getOnly:true,tenant:'savagerise.com',iterations:[],blockedWrites:[],metadata:{}}
const save=()=>writeFile(out+'/public-series.json',JSON.stringify(report,null,2))
async function read(url){const start=performance.now();const response=await fetch(url,{headers:tenantHeaders,signal:AbortSignal.timeout(25000),redirect:'manual'});const body=await response.text();return {status:response.status,headers:headers(response),location:response.headers.get('location'),ms:performance.now()-start,body}}
await mkdir(out+'/public',{recursive:true})
for(const [name,url] of Object.entries({config:api+'/storefront/config',studio:api+'/storefront/studio',categories:api+'/catalog/categories',products:api+'/catalog/products?page=1&page_size=100',physical:api+'/catalog/products?page=1&page_size=100&product_kind=physical',vlog:api+'/storefront/vlog'})){
 const r=await read(url);report.metadata[name]={...r,body:undefined};await writeFile(out+'/public/'+name+'.json',r.body)
}
const initial=JSON.parse(await readFile(out+'/public/physical.json','utf8'))
for(const p of initial.items||[]){const r=await read(api+'/catalog/products/'+encodeURIComponent(p.slug));await writeFile(out+'/public/product-'+p.slug+'.json',r.body)}
const deployment=JSON.parse(await readFile('artifacts/catalog-resilience/evidence/deployment-status.json','utf8').catch(()=>'[]'))[0]
if(deployment){const deployed=await read(deployment.environment_url+'/products')
report.metadata.deployment={url:deployment.environment_url,...deployed,body:undefined,bodyHash:createHash('sha256').update(deployed.body).digest('hex')}}
const browser=await chromium.launch({channel:'chrome',headless:true})
let context,page,activeSample
async function newSession(){if(context)await context.close();context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await context.route('**/*',route=>{const r=route.request(),u=new URL(r.url());if(!['GET','HEAD'].includes(r.method())){report.blockedWrites.push({method:r.method(),path:u.origin+u.pathname});return route.abort()}if(['www.savagerise.com','savagerise.com','ik.imagekit.io','yovo-api-gateway-a8da1d8e66a3.herokuapp.com'].includes(u.hostname))return route.continue();return route.abort()});page=await context.newPage();page.on('response',async r=>{const s=activeSample,u=new URL(r.url());if(!s||u.pathname!=='/products'||!u.searchParams.has('_rsc'))return;try{const body=await r.text();s.rsc??=[];s.rsc.push({status:r.status(),headers:await r.allHeaders(),bytes:body.length,hasOmbra:body.includes('6b032d527b49ec9b6c39ec4d'),hasHoodies:body.includes('Hoodies')});await writeFile(out+'/public/rsc-'+s.index+'-'+s.rsc.length+'.txt',body)}catch{}})}
const modes=['direct','reload','home-to-shop','product-to-shop','private-session']
try{
 await newSession()
 for(let i=0;i<50;i++){
  const mode=modes[i%5],sample={index:i+1,mode,at:new Date().toISOString(),errors:[]},start=performance.now();activeSample=sample
  try{
   if(mode==='private-session')await newSession()
   const onError=e=>sample.errors.push({message:e.message,stack:e.stack});page.on('pageerror',onError)
   const [list,cats]=await Promise.all([read(api+'/catalog/products?page=1&page_size=100&product_kind=physical'),read(api+'/catalog/categories')])
   const items=JSON.parse(list.body),categories=JSON.parse(cats.body)
   sample.api={status:list.status,headers:list.headers,ms:list.ms,total:items.total,page:items.page,pages:items.pages,size:items.page_size,hasNext:items.has_next,ids:items.items?.map(p=>p.id)}
   sample.categories={status:cats.status,headers:cats.headers,ms:cats.ms,ids:Array.isArray(categories)?categories.map(c=>c.id):[],hoodies:Array.isArray(categories)?categories.some(c=>c.slug==='hoodies'):false}
   let response
   if(mode==='reload')response=await page.reload({waitUntil:'domcontentloaded',timeout:60000})
   else if(mode==='home-to-shop'){
    await page.goto(base,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForSelector('[data-studio-hydrated="true"]',{timeout:20000});await page.waitForSelector('[data-store-entrance-pending="false"]',{timeout:10000})
    await page.locator('.store-header a[href="/products"]').first().click();await page.waitForURL(base+'/products')
   }else if(mode==='product-to-shop'){
    await page.goto(base+'/products/sr-ombra-oversized-hoodie',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForSelector('[data-studio-hydrated="true"]',{timeout:20000});await page.waitForSelector('[data-store-entrance-pending="false"]',{timeout:10000});await page.getByRole('link',{name:'Back to Shop',exact:true}).click();await page.waitForURL(base+'/products')
   }else response=await page.goto(base+'/products',{waitUntil:'domcontentloaded',timeout:60000})
   if(response){const html=await response.text();sample.document={status:response.status(),headers:await response.allHeaders(),ssrSlugs:[...html.matchAll(/<article class="store-product-card[\s\S]*?<a[^>]*href="\/products\/([^"?]+)/g)].map(m=>m[1]),chunks:[...html.matchAll(/src="(\/_next\/static\/[^" ]+\.js[^" ]*)"/g)].map(m=>m[1])};if(i===0)await writeFile(out+'/public/shop.html',html)}
   await page.waitForSelector('[data-studio-hydrated="true"]',{timeout:20000})
   await page.locator('.store-catalog .store-product-grid').waitFor({state:'visible',timeout:20000})
   await page.locator('.store-catalog .store-product-card').first().waitFor({state:'visible',timeout:20000})
   await page.waitForTimeout(500)
   sample.dom=await page.locator('.store-product-card').evaluateAll(cards=>cards.map(card=>({name:card.querySelector('.store-product-name')?.textContent,slug:card.querySelector('a')?.getAttribute('href')?.split('/').at(-1),price:card.querySelector('.store-product-price')?.textContent})))
   await page.getByRole('combobox',{name:'Category',exact:true}).click();await page.getByRole('option').first().waitFor();sample.filterOptions=await page.getByRole('option').allTextContents();await page.keyboard.press('Escape')
   sample.missing=(items.items||[]).filter(p=>!sample.dom.some(c=>c.slug===p.slug)).map(p=>p.id)
   sample.duplicateSlugs=sample.dom.map(c=>c.slug).filter((s,n,all)=>all.indexOf(s)!==n)
   sample.referenceChanged=JSON.stringify([...(sample.api.ids||[])].sort())!==JSON.stringify(initial.items.map(p=>p.id).sort())
   sample.pass=!sample.referenceChanged&&sample.dom.length===items.total&&!sample.missing.length&&!sample.duplicateSlugs.length&&sample.categories.hoodies&&sample.filterOptions.includes('Hoodies')&&!sample.errors.length
   sample.counter=await page.locator('.store-catalog header p').innerText();sample.url=page.url()
   if(!sample.pass){await writeFile(out+'/public/final-failure-'+(i+1)+'-list.json',list.body);await page.screenshot({path:out+'/public/final-failure-'+(i+1)+'.png'});await writeFile(out+'/public/final-failure-'+(i+1)+'-dom.html',await page.content())}
   page.off('pageerror',onError)
  }catch(e){sample.pass=false;sample.failure=e.message}
  sample.ms=performance.now()-start;report.iterations.push(sample);await save();console.log(JSON.stringify({index:sample.index,mode,pass:sample.pass,count:sample.dom?.length,total:sample.api?.total,missing:sample.missing,failure:sample.failure}))
 }
}finally{await browser.close();report.finished=new Date().toISOString();await save()}
const failures=report.iterations.filter(sample=>!sample.pass).length
if(failures||report.iterations.length!==50)process.exitCode=1
console.log(JSON.stringify({loads:report.iterations.length,failures,report:out+'/public-series.json'}))

