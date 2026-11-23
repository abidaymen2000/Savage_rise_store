import { chromium, expect } from '../.tmp/qa/node_modules/@playwright/test/index.mjs'
import { mkdir,writeFile,mkdtemp,cp } from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
// Writing new screenshots inside the workspace can trigger Next's development watcher.
const dir=await mkdtemp(join(tmpdir(),'savage-rise-captures-'))
const base='http://127.0.0.1:49172'
// Stabilize Next's on-demand development chunks before opening Chrome.
for(const path of ['/','/products','/products/sr-ombra-oversized-hoodie']) {
  const response=await fetch(base+path);if(!response.ok)throw new Error(`Warmup ${path}: ${response.status}`);await response.arrayBuffer()
}
const browser=await chromium.launch({channel:'chrome',headless:true})
const context=await browser.newContext({viewport:{width:1440,height:1080},colorScheme:'light',reducedMotion:'reduce'})
await context.addInitScript(()=>{sessionStorage.setItem('savage_rise_visited','true');localStorage.setItem('theme','light')})
// Backend calls may reach only the isolated local fixture. Remote media remains GET-only.
await context.route('**/*',route=>{
  const request=route.request(),url=new URL(request.url())
  if(['127.0.0.1','localhost'].includes(url.hostname))return route.continue()
  if(url.hostname==='ik.imagekit.io'&&['GET','HEAD'].includes(request.method()))return route.continue()
  return route.abort()
})
const page=await context.newPage(),failures=[],checks=[]
page.on('pageerror',error=>failures.push(error.message))
for(const [name,path] of [['home','/'],['shop','/products'],['product','/products/sr-ombra-oversized-hoodie']]){
  await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:120000})
  await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1,{timeout:30000})
  await page.locator('main').first().waitFor()
  await page.evaluate(()=>document.fonts.ready)
  for(const width of [320,375,390,768,1024,1440]){
    await page.setViewportSize({width,height:width<768?844:1080})
    await page.evaluate(()=>window.scrollTo(0,0))
    await page.waitForTimeout(700)
    await page.evaluate(async()=>{await Promise.all([...document.images].filter(img=>img.getBoundingClientRect().top<innerHeight).map(img=>img.decode().catch(()=>{})))})
    const layout=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth,broken:[...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight&&i.complete&&!i.naturalWidth).map(i=>i.currentSrc)}))
    checks.push({name,width,...layout})
    if(layout.scroll>width)failures.push(`${name} ${width}: horizontal overflow ${layout.scroll}`)
    await page.screenshot({path:`${dir}/${name}-${width}.png`})
    const captureSection=async(selector,file)=>{await page.locator(selector).evaluate(el=>window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top-108));await page.screenshot({path:`${dir}/${file}-${width}.png`})}
    if(name==='product' && [320,390,768,1024,1440].includes(width)){
      await captureSection('.store-product-info','product-options')
      await captureSection('.store-purchase-actions','product-purchase')
    }
    if(name==='home' && [390,1440].includes(width))await captureSection('.store-new-section','home-products')
  }
  if(name==='home'){
    const labels=await page.locator('.store-category-card').allTextContents()
    for(const label of ['Hoodies','Pants','T-shirts'])expect(labels.some(x=>x.includes(label))).toBe(true)
    checks.push({name:'dynamic categories',labels})
  }
  if(name==='shop'){
    await expect(page.locator('.store-product-card')).toHaveCount(5)
    await expect(page.getByRole('heading',{name:'SR OMBRA OVERSIZED HOODIE',exact:true})).toBeVisible()
  }
}
await writeFile(`${dir}/layout-checks.json`,JSON.stringify({checks,failures},null,2))
console.log(JSON.stringify({checks,failures},null,2))
await browser.close()
await mkdir('artifacts/store-redesign/after',{recursive:true})
await cp(dir,'artifacts/store-redesign/after',{recursive:true})
if(failures.length)process.exitCode=1
