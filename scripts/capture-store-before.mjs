import { chromium } from '../.tmp/qa/node_modules/@playwright/test/index.mjs'
import { mkdir, writeFile } from 'node:fs/promises'
const dir = 'artifacts/store-redesign/before'
await mkdir(dir,{recursive:true})
const browser = await chromium.launch({channel:'chrome',headless:true})
const context = await browser.newContext({viewport:{width:1440,height:1080},colorScheme:'light'})
await context.addInitScript(() => sessionStorage.setItem('savage_rise_visited','true'))
await context.route('**/*', route => ['GET','HEAD'].includes(route.request().method()) ? route.continue() : route.abort())
const page = await context.newPage()
const summary=[]
for (const [name,path] of [['home','/'],['shop','/products']]) {
  await page.goto('https://www.savagerise.com'+path,{waitUntil:'domcontentloaded',timeout:60000})
  await page.waitForTimeout(4000)
  const data=await page.evaluate(() => ({text:document.body.innerText,links:[...document.querySelectorAll('a[href*="/products/"]')].map(a=>({href:a.getAttribute('href'),text:a.textContent})),stream:(window.__next_f||[]).filter(a=>a[0]===1).map(a=>a[1]).join('')}))
  await writeFile(`${dir}/${name}-rsc.txt`,data.stream)
  const products=[],categories=[]
  const visit = value => {if(!value||typeof value!=='object') return; if(value.id&&value.name&&value.variants) products.push(value);if(value.id&&value.name&&'parent_id' in value)categories.push(value);for(const item of Object.values(value))visit(item)}
  for (const line of data.stream.split('\n')) {try {visit(JSON.parse(line.slice(line.indexOf(':')+1)))}catch{}}
  await writeFile(`${dir}/${name}-data.json`,JSON.stringify({products,categories},null,2))
  summary.push({name,text:data.text,links:data.links,products:products.map(p=>({id:p.id,name:p.name,slug:p.slug,kind:p.product_kind})),categories})
  await page.screenshot({path:`${dir}/${name}-desktop.png`})
  await page.setViewportSize({width:390,height:844})
  await page.screenshot({path:`${dir}/${name}-mobile.png`})
  await page.setViewportSize({width:1440,height:1080})
}
const productLink=summary.flatMap(x=>x.links).find(l=>/OMBRA/i.test(l.text))||summary[1].links[0]
if(productLink){
  await page.goto(new URL(productLink.href,'https://www.savagerise.com').href,{waitUntil:'domcontentloaded',timeout:60000})
  await page.waitForTimeout(3000)
  await page.screenshot({path:`${dir}/product-desktop.png`})
  await page.setViewportSize({width:390,height:844})
  await page.screenshot({path:`${dir}/product-mobile.png`})
  summary.push({name:'product',url:page.url(),text:await page.locator('body').innerText()})
}
await writeFile(`${dir}/browser-audit.json`,JSON.stringify(summary,null,2))
console.log(JSON.stringify(summary.map(({name,products,categories,url})=>({name,products,categories,url})),null,2))
await browser.close()
