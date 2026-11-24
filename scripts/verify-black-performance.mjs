import { chromium, expect as pwExpect } from '../.tmp/qa/node_modules/@playwright/test/index.mjs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
const expect=pwExpect.configure({timeout:30000}),base='http://127.0.0.1:49176',fixture='http://127.0.0.1:49175'
const out='artifacts/black-performance/evidence/black-final'
await mkdir(out,{recursive:true})
const state=value=>fetch(fixture+'/__test/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)})
const reset=()=>fetch(fixture+'/__test/reset',{method:'POST'})
if(!(await(await fetch(fixture+'/health')).json()).fixture)throw Error('Local fixture required')
await reset();await state({compact:true,pageSize:100})
const raw=JSON.parse(await readFile('artifacts/black-performance/evidence/public/slug.json','utf8'))
const black=raw.variants.filter(v=>v.option_values.color==='black')
const report={checks:[],errors:[],started:new Date().toISOString()}
const browser=await chromium.launch({channel:'chrome',headless:true})
try{
 for(const width of [320,375,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:width<768?844:1000},colorScheme:'light',reducedMotion:'reduce'})
  await context.route('**/*',route=>{const r=route.request(),u=new URL(r.url());return ['127.0.0.1','localhost'].includes(u.hostname)||u.hostname==='ik.imagekit.io'&&['GET','HEAD'].includes(r.method())?route.continue():route.abort()})
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push({width,message:e.message,stack:e.stack}))
  await page.goto(base+'/products',{waitUntil:'domcontentloaded',timeout:120000});await page.locator('[data-studio-hydrated="true"]').waitFor()
  await expect(page.locator('.store-product-card')).toHaveCount(5)
  await page.locator('a[href="/products/'+raw.slug+'"]').first().click();await page.locator('.store-product-detail').waitFor();await page.locator('[data-studio-hydrated="true"]').waitFor()
  await page.getByRole('button',{name:'Color Black',exact:true}).click()
  await expect(page.locator('.store-selected-color')).toHaveText('Black')
  await expect(page.getByRole('button',{name:/Dark Black/i})).toHaveCount(0)
  const swatch=await page.getByRole('button',{name:'Color Black',exact:true}).locator('.store-color-disc').evaluate(el=>getComputedStyle(el).backgroundColor)
  expect(swatch).toBe('rgb(17, 17, 17)')
  const rows=[]
  for(const variant of black){
   const size=variant.option_value_labels.size
   await page.getByRole('button',{name:size,exact:true}).click()
   await expect(page.locator('.store-size-button[aria-pressed="true"]')).toHaveText(size)
   await expect(page.locator('.store-product-info')).toContainText(variant.sku)
   await expect(page.locator('.store-detail-price')).toContainText('89,900')
   await expect(page.locator('.store-add-button')).toBeEnabled()
   const expected=variant.media.find(m=>m.is_primary).url.split('?')[0]
   await expect(page.locator('.store-gallery-main img')).toHaveAttribute('src',new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')))
   rows.push({size,sku:variant.sku,price:89.9,primary:expected})
  }
  expect(rows.length).toBe(5)
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}))
  await page.screenshot({path:`${out}/black-${width}.png`,fullPage:true})
  await page.getByRole('link',{name:'Back to Shop',exact:true}).click();await expect(page.locator('.store-product-card')).toHaveCount(5)
  await page.locator('a[href="/products/sr-palazzo-baggy-pants"]').first().click();await expect(page.getByRole('heading',{level:1})).toContainText('PALAZZO')
  await page.goBack();await expect(page.locator('.store-product-card')).toHaveCount(5)
  await page.goto(base+'/on',{waitUntil:'domcontentloaded',timeout:120000});await page.locator('[data-studio-hydrated="true"]').waitFor()
  await expect(page.getByText('404',{exact:true})).toBeVisible()
  if(width<1024)await page.getByRole('button',{name:'Open Menu',exact:true}).click()
  await page.locator('.store-header a[href="/products"]').filter({visible:true}).first().click();await expect(page.locator('.store-product-card')).toHaveCount(5)
  report.checks.push({name:'Black, five sizes, navigation, /on and responsive',width,swatch,rows,pass:true});console.log('PASS '+width)
  await context.close()
 }
 expect(report.errors).toEqual([])
}catch(error){report.failure=error.message;process.exitCode=1;console.error(error.message)}
finally{await browser.close();await reset();report.finished=new Date().toISOString();await writeFile(out+'/checks.json',JSON.stringify(report,null,2))}
