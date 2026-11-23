// Read-only public snapshots, in-memory commerce fixtures, and local Next dev only.
import {chromium,expect as pwExpect} from '../.tmp/qa/node_modules/@playwright/test/index.mjs'
import {readFile,writeFile,mkdir} from 'node:fs/promises'
const base=process.env.ENGLISH_TEST_URL||'http://127.0.0.1:49176'
const fixture=process.env.ENGLISH_FIXTURE_URL||'http://127.0.0.1:49175'
const out='artifacts/store-english-audit/evidence'
const expect=pwExpect.configure({timeout:20000})
const read=name=>readFile(`${out}/public/${name}.json`,'utf8').then(JSON.parse)
const studio=await read('studio'),products=(await read('products')).items
await mkdir(out+'/after',{recursive:true})
if(!(await (await fetch(fixture+'/health')).json()).fixture)throw new Error('Local fixture required')
await fetch(fixture+'/__test/reset',{method:'POST'})
const paths=['/','/products','/products/sr-ombra-oversized-hoodie','/about','/vlog','/packs','/shipping','/returns','/contact','/help','/size-guide','/profile','/profile/edit','/profile/change-password','/checkout','/reset-password','/verify-email','/verify-success','/email-confirmed','/email-verification-failed','/products/not-a-product','/pages/not-a-page']
// Serial warmup avoids shared development chunks being recompiled mid-download.
for(const path of paths){const r=await fetch(base+path);await r.arrayBuffer();console.log(`WARM ${path} ${r.status}`)}
const browser=await chromium.launch({channel:'chrome',headless:true})
const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'en-US',colorScheme:'light',reducedMotion:'reduce'})
await context.addInitScript(()=>{if(window.top!==window)return;sessionStorage.setItem('savage_rise_visited','true');localStorage.setItem('theme','light')})
await context.route('**/*',route=>{
 const r=route.request(),u=new URL(r.url())
 if(['127.0.0.1','localhost'].includes(u.hostname))return route.continue()
 if(u.hostname==='ik.imagekit.io'&&['GET','HEAD'].includes(r.method()))return route.continue()
 return route.abort()
})
const report={started:new Date().toISOString(),checks:[],errors:[],responsive:[],pages:[],newsletter:[],erp:[]}
const page=await context.newPage()
page.on('pageerror',e=>report.errors.push({url:page.url(),message:e.message,stack:e.stack}))
const go=async path=>{await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:120000});await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1,{timeout:30000})}
const check=async(name,fn)=>{try{await fn();report.checks.push({name,status:'PASS'});console.log('PASS '+name)}catch(e){report.checks.push({name,status:'FAIL',error:e.message});console.error('FAIL '+name+' '+e.message);process.exitCode=1}}
const layout=async()=>page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,lang:document.documentElement.lang}))
const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number)
const luminance=color=>color.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0)
const contrast=(a,b)=>{const l=[luminance(rgb(a)),luminance(rgb(b))].sort((a,b)=>b-a);return (l[0]+.05)/(l[1]+.05)}
try{
 for(const width of [320,375,390,768,1440])await check(`English UI and dynamic data at ${width}px`,async()=>{
  await page.setViewportSize({width,height:width<768?844:1000})
  for(const path of ['/','/products','/products/sr-ombra-oversized-hoodie']){
   await go(path)
   const box=await layout();report.responsive.push({path,...box});expect(box.lang).toBe('en');expect(box.scrollWidth).toBeLessThanOrEqual(width)
   if(path==='/'){
    expect(await page.locator('h1').textContent()).toBe(studio.studio.hero.title)
    await expect(page.getByText(studio.studio.hero.subtitle,{exact:true})).toBeVisible()
    if(width<1024){
     await page.getByRole('button',{name:'Open Menu',exact:true}).click()
     await expect(page.getByRole('dialog',{name:'Mobile Menu',exact:true})).toBeVisible()
     await expect(page.getByRole('button',{name:'Use System theme',exact:true})).toBeVisible()
     await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0)
    }
    const newsletter=page.locator('section').filter({has:page.getByRole('heading',{name:'Be Part of the Next Chapter.'})})
    await newsletter.scrollIntoViewIfNeeded();await expect(newsletter.locator('input,form')).toHaveCount(0)
    await expect(newsletter).toContainText('Be first to discover new drops, exclusive releases, and the latest from Savage Rise.')
    await expect(newsletter).toContainText('Something exclusive is coming. Stay tuned for early access to our next drops.')
    if([390,1440].includes(width))await newsletter.screenshot({path:`${out}/after/newsletter-${width}-light.png`})
   }else if(path==='/products'){
    await expect(page.locator('h1')).toHaveText('Shop')
    const cards=await page.locator('.store-product-card').evaluateAll(cards=>cards.map(card=>({name:card.querySelector('.store-product-name').textContent,href:card.querySelector('a').getAttribute('href')})))
    expect(cards.map(c=>c.name).sort()).toEqual(products.map(p=>p.name).sort())
    expect(cards.map(c=>c.href).sort()).toEqual(products.map(p=>'/products/'+p.slug).sort())
    if(width===1440)report.erp.push({width,cards})
    if([390,1440].includes(width))await page.screenshot({path:`${out}/after/catalog-${width}.png`})
   }else{
    await expect(page.locator('.store-add-button')).toContainText('Add to Bag')
    const product=await read('product-sr-ombra-oversized-hoodie')
    const colors=product.option_axes.find(a=>a.system_key==='color'||a.code==='color').values.map(v=>v.label)
    const labels=await page.locator('.store-color-option').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label').replace(/^Color /,'')))
    expect(labels.sort()).toEqual([...colors].sort());report.erp.push({width,expected:colors,displayed:labels})
    if(width===390)await page.screenshot({path:`${out}/after/product-390.png`})
   }
  }
 })
 await check('Newsletter AA contrast in both themes',async()=>{
  await page.setViewportSize({width:1440,height:1000});await go('/')
  const section=page.locator('section').filter({has:page.getByRole('heading',{name:'Be Part of the Next Chapter.'})})
  const before=JSON.parse(await readFile(out+'/public-browser-before.json','utf8')).newsletter
  report.newsletter.push({theme:'before-light',ratio:contrast(before.color,before.background)})
  for(const theme of ['light','dark']){
   await page.getByRole('button',{name:'Choose theme',exact:true}).click();await page.getByRole('menuitemradio',{name:theme,exact:false}).click()
   await expect(page.locator('html')).toHaveClass(new RegExp(theme))
   await section.scrollIntoViewIfNeeded()
   const values=await section.evaluate(s=>({background:getComputedStyle(s).backgroundColor,gradient:getComputedStyle(s).backgroundImage,paragraphs:[...s.querySelectorAll('p')].map(p=>({text:p.textContent,color:getComputedStyle(p).color,opacity:getComputedStyle(p).opacity,font:getComputedStyle(p).fontFamily}))}))
   // Dark gradient endpoints are #0b0b0a and black; test the brighter, weaker endpoint.
   const bg=theme==='dark'?'rgb(11,11,10)':values.background
   report.newsletter.push({theme,...values})
   for(const p of values.paragraphs){p.ratio=contrast(p.color,bg);expect(p.ratio).toBeGreaterThanOrEqual(4.5)}
   if(theme==='dark')await section.screenshot({path:`${out}/after/newsletter-1440-dark.png`})
  }
 })
 await check('Public pages, metadata and English guest/error states',async()=>{
  await page.getByRole('button',{name:'Choose theme',exact:true}).click();await page.getByRole('menuitemradio',{name:'Light',exact:true}).click()
  await page.setViewportSize({width:390,height:844})
  for(const path of paths.slice(3)){
   await go(path)
   const data=await page.evaluate(()=>({lang:document.documentElement.lang,title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonical:[...document.querySelectorAll('link[rel="canonical"]')].map(n=>n.href),ogLocale:document.querySelector('meta[property="og:locale"]')?.content,headings:[...document.querySelectorAll('h1,h2')].map(n=>n.textContent),text:document.querySelector('main')?.innerText,width:innerWidth,scrollWidth:document.documentElement.scrollWidth}))
   report.pages.push({path,...data});console.log('PAGE '+path);expect(data.lang).toBe('en');expect(data.scrollWidth).toBeLessThanOrEqual(data.width);expect(data.canonical.length).toBeLessThanOrEqual(1)
   expect(data.text||'').not.toMatch(/When we publishes|Aucun pack disponible|Choisir une taille|Ajouter au panier|Connexion requise|Une erreur est survenue/)
   if(path==='/packs')await expect(page.getByText('No packs available right now. Explore our latest pieces in the shop.',{exact:true})).toBeVisible()
  }
 })
 await check('No JavaScript errors',async()=>expect(report.errors).toEqual([]))
}finally{await browser.close();await writeFile(out+'/english-browser.json',JSON.stringify(report,null,2))}
