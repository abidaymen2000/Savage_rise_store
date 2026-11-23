import {chromium,expect as pwExpect} from '../.tmp/qa/node_modules/@playwright/test/index.mjs'
import {mkdtemp,mkdir,cp,writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {tmpdir} from 'node:os'

const expect=pwExpect.configure({timeout:30000})
const base=process.env.ENTRANCE_TEST_URL||'http://127.0.0.1:49176'
const fixture=process.env.ENTRANCE_FIXTURE_URL||'http://127.0.0.1:49175'
const realMedia=process.env.ENTRANCE_REAL_MEDIA==='1'
const out=await mkdtemp(join(tmpdir(),'savage-entrance-'))
const report={started:new Date().toISOString(),mediaSource:realMedia?'published Studio media':'published poster and local test film',checks:[],errors:[],motion:[],imageFailures:[]}
const state=body=>fetch(fixture+'/__test/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
const reset=()=>fetch(fixture+'/__test/reset',{method:'POST'})
if(!(await (await fetch(fixture+'/health')).json()).fixture)throw new Error('Local fixture required')
await reset();await state({video:!realMedia})
// Compile all shared development chunks before opening the browser.
for(const path of ['/','/products','/products/sr-ombra-oversized-hoodie']){const r=await fetch(base+path);if(!r.ok)throw new Error(path+' '+r.status);await r.arrayBuffer()}
const browser=await chromium.launch({channel:'chrome',headless:true})
const contexts=[]

async function open({width=1440,reduced=false,record=false,javaScriptEnabled=true,storageBlocked=false,chunksBlocked=false}={}){
 const viewport={width,height:width<768?844:900}
 const context=await browser.newContext({viewport,colorScheme:'light',reducedMotion:reduced?'reduce':'no-preference',javaScriptEnabled,...(record?{recordVideo:{dir:out,size:viewport}}:{})})
 contexts.push(context)
 await context.route('**/*',route=>{
  const req=route.request(),url=new URL(req.url())
  if(chunksBlocked&&url.pathname.includes('/_next/')&&url.pathname.endsWith('.js'))return route.abort()
  if(['127.0.0.1','localhost'].includes(url.hostname))return route.continue()
  if(url.hostname==='ik.imagekit.io'&&['GET','HEAD'].includes(req.method()))return route.continue()
  return route.abort()
 })
 await context.addInitScript(({storageBlocked})=>{
  localStorage.setItem('theme','light')
  // Exercise the entrance key boundary here. Full storage denial, analytics
  // hydration and navigation are covered by verify-entrance-resilience.
  if(storageBlocked)for(const method of ['getItem','setItem']){
   const original=Storage.prototype[method]
   Storage.prototype[method]=function(key,...args){if(key==='savage_rise_visited')throw new DOMException('Entrance storage disabled','SecurityError');return original.call(this,key,...args)}
  }
  window.entranceQA={states:[],unlocks:[],videos:[],shifts:[],observers:new Set()}
  const native=window.MutationObserver
  window.MutationObserver=class extends native{
   observe(target,options){if(options?.attributeFilter?.includes('data-store-entrance-pending'))window.entranceQA.observers.add(this);return super.observe(target,options)}
   disconnect(){window.entranceQA.observers.delete(this);return super.disconnect()}
  }
  new native(()=>{
   const qa=window.entranceQA,stage=document.documentElement?.dataset.storeEntrance
   if(stage&&stage!==qa.states.at(-1)?.stage){
    const hero=document.querySelector('[data-playback="hero-cycle"] img'),logo=document.querySelector('.store-header img')
    const fallback=document.querySelector('[data-hero-fallback]')
    qa.states.push({stage,time:performance.now(),heroReady:!!hero?.complete&&hero.naturalWidth>0,heroFallback:!!fallback&&fallback.getBoundingClientRect().height>0,logoReady:!!logo?.complete&&logo.naturalWidth>0})
   }
   if(document.querySelector('[data-store-entrance-pending="false"]')&&!qa.unlocks.length)qa.unlocks.push(performance.now())
  }).observe(document,{subtree:true,attributes:true,attributeFilter:['data-store-entrance','data-store-entrance-pending']})
  for(const type of ['playing','ended'])document.addEventListener(type,event=>{
   if(event.target instanceof HTMLVideoElement&&event.target.closest('[data-playback="hero-cycle"]'))window.entranceQA.videos.push({type,time:performance.now()})
  },true)
  new PerformanceObserver(list=>{for(const item of list.getEntries())if(!item.hadRecentInput)window.entranceQA.shifts.push({time:item.startTime,value:item.value})}).observe({type:'layout-shift',buffered:true})
 },{storageBlocked})
 const page=await context.newPage()
 page.on('pageerror',error=>report.errors.push({message:error.message,stack:error.stack}))
 page.on('requestfailed',request=>{if(request.resourceType()==='image')report.imageFailures.push({url:request.url(),error:request.failure()?.errorText})})
 return {context,page}
}

const go=page=>page.goto(base,{waitUntil:'commit',timeout:120000})
// CDP captures the actual animation frame without waiting for document.fonts.ready.
// Waiting for all fonts would miss a deliberately short, pre-hydration entrance.
const shot=async(page,name)=>{const session=await page.context().newCDPSession(page);const {data}=await session.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(join(out,name),Buffer.from(data,'base64'));await session.detach()}
const settled=async page=>{await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1);await expect(page.locator('[data-store-entrance-pending]')).toHaveAttribute('data-store-entrance-pending','false')}
const checkpoint=async(name,fn)=>{await fn();report.checks.push({name,pass:true});console.log('PASS '+name)}

try{
 for(const width of (realMedia?[390,1440]:[320,375,390,768,1440]))await checkpoint(`complete introduction and Hero at ${width}px`,async()=>{
  const {context,page}=await open({width,record:[390,1440].includes(width)})
  await go(page)
  await page.waitForFunction(()=>window.entranceQA?.states.some(s=>s.stage==='pending'))
  for(const [time,name] of [[100,'doors'],[1100,'opening'],[2200,'wordmark'],[3000,'reveal'],[3600,'home']]){
   await page.waitForFunction(ms=>performance.now()-window.entranceQA.states[0].time>=ms,time)
   await shot(page,`${name}-${width}.png`)
  }
  await settled(page)
  const hero=page.locator('[data-playback="hero-cycle"]')
  await expect(hero.locator('[data-hero-poster]')).toHaveAttribute('data-hero-poster-state','ready')
  await expect(hero).toHaveAttribute('data-playback-state','poster')
  await shot(page,`hero-image-${width}.png`)
  await expect(hero).toHaveAttribute('data-playback-state','video')
  await shot(page,`hero-video-${width}.png`)
  await expect.poll(()=>page.evaluate(()=>window.entranceQA.videos.filter(v=>v.type==='playing').length)).toBeGreaterThanOrEqual(2)
  const result=await page.evaluate(()=>({states:window.entranceQA.states,unlocks:window.entranceQA.unlocks,videos:window.entranceQA.videos,shifts:window.entranceQA.shifts,overflow:document.documentElement.scrollWidth>innerWidth,inert:document.querySelector('.store-entrance-content').inert,visited:sessionStorage.getItem('savage_rise_visited')}))
  const start=result.states.find(s=>s.stage==='pending').time,end=result.states.find(s=>s.stage==='complete').time
  expect(end-start).toBeGreaterThanOrEqual(3250);expect(end-start).toBeLessThan(4000)
  expect(result.videos[0].time-Math.max(end,result.unlocks[0])).toBeGreaterThanOrEqual(1950)
  const ended=result.videos.find(v=>v.type==='ended'),restart=result.videos.find(v=>v.type==='playing'&&v.time>ended.time)
  expect(restart.time-ended.time).toBeGreaterThanOrEqual(1950)
  const film=await hero.locator('video').evaluate(v=>({src:v.currentSrc,duration:v.duration,currentTime:v.currentTime}))
  expect((ended.time-result.videos[0].time)/1000).toBeGreaterThanOrEqual(film.duration-.25)
  result.film=film
  expect(result.overflow).toBe(false);expect(result.inert).toBe(false);expect(result.visited).toBe('true')
  const revealed=result.states.find(s=>s.stage==='complete')
  expect(revealed.heroReady||revealed.heroFallback).toBe(true)
  await page.evaluate(()=>scrollTo(0,500));expect(await page.evaluate(()=>scrollY)).toBeGreaterThan(0)
  report.motion.push({width,...result})
  const video=page.video();await context.close();if(video)await video.saveAs(join(out,`restored-${width}.webm`))
 })

 if(!realMedia){
 await checkpoint('same-session reload, shop, PDP and return home do not replay; observers clean up',async()=>{
  const {context,page}=await open();await go(page);await settled(page)
  await page.locator('.store-header a[href="/products"]').first().click();await expect(page).toHaveURL(/\/products$/)
  await page.locator('a[href="/products/sr-ombra-oversized-hoodie"]').first().click();await expect(page).toHaveURL(/sr-ombra-oversized-hoodie$/)
  await expect(page.locator('.store-entrance')).toHaveCount(0)
  await expect.poll(()=>page.evaluate(()=>window.entranceQA.observers.size)).toBe(0)
  await page.locator('.store-header a[href="/"]').first().click();await expect(page).toHaveURL(base+'/')
  await expect(page.locator('.store-entrance')).toHaveCount(0)
  await page.reload({waitUntil:'domcontentloaded'});await settled(page)
  expect(await page.evaluate(()=>window.entranceQA.states.some(s=>s.stage==='pending'))).toBe(false)
  await context.close()
 })
 await checkpoint('new session and direct PDP entry retain the historical trigger',async()=>{
  const {context,page}=await open();await page.goto(base+'/products/sr-ombra-oversized-hoodie',{waitUntil:'commit'});await settled(page)
  expect(await page.evaluate(()=>window.entranceQA.states.some(s=>s.stage==='pending'))).toBe(true)
  await expect(page.locator('.store-add-button')).toBeEnabled();await context.close()
 })
 await checkpoint('keyboard skip, Escape and restored mobile navigation',async()=>{
  const {context,page}=await open({width:390});await go(page)
  await expect(page.locator('.store-entrance')).toBeVisible();await page.keyboard.press('Tab');await expect(page.locator('.store-entrance-skip')).toBeFocused();await page.keyboard.press('Escape')
  await settled(page);await page.getByRole('button',{name:/menu/i}).first().click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);await context.close()
 })
 await checkpoint('reduced motion keeps a static signature and minimal fade',async()=>{
  const {context,page}=await open({width:390,reduced:true,record:true});await go(page)
  await page.waitForFunction(()=>window.entranceQA?.states.length)
  await shot(page,'reduced-390.png');await settled(page)
  const data=await page.evaluate(()=>({states:window.entranceQA.states,videos:window.entranceQA.videos}))
  expect(data.states.find(s=>s.stage==='complete').time-data.states[0].time).toBeLessThan(900)
  await expect(page.locator('[data-playback="hero-cycle"]')).toHaveAttribute('data-playback-state','poster')
  report.motion.push({mode:'reduced',...data});const video=page.video();await context.close();await video.saveAs(join(out,'restored-reduced-390.webm'))
 })
 await checkpoint('unavailable entrance session key completes without errors',async()=>{
  const {context,page}=await open({storageBlocked:true});await go(page);await settled(page);await expect(page.getByRole('heading',{level:1})).toHaveText('DROP-003');await context.close()
 })
 await checkpoint('missing application chunks cannot trap the visitor behind the introduction',async()=>{
  const {context,page}=await open({chunksBlocked:true});await go(page);await expect(page.locator('html')).toHaveAttribute('data-store-entrance','complete')
  await expect(page.locator('main').first()).toBeVisible();expect(await page.evaluate(()=>getComputedStyle(document.documentElement).overflowY)).not.toBe('hidden');await context.close()
 })
 await checkpoint('without JavaScript the server-rendered store remains usable',async()=>{
  const {context,page}=await open({javaScriptEnabled:false});await go(page);await expect(page.locator('main').first()).toBeVisible();await expect(page.locator('.store-entrance')).toBeHidden();await context.close()
 })
 await checkpoint('CMS draft bypasses introduction and retains authored content',async()=>{
  await state({draftHero:{title:'Brouillon de recette introduction'}})
  const {context,page}=await open();await context.addCookies([{name:'yovo_studio_preview',value:'local-preview-token',url:base}]);await go(page);await settled(page)
  await expect(page.getByRole('heading',{level:1})).toHaveText('Brouillon de recette introduction');await expect(page.locator('.store-entrance')).toHaveCount(0)
  expect(await page.evaluate(()=>sessionStorage.getItem('savage_rise_visited'))).toBeNull();await context.close();await reset();await state({video:true})
 })
 await checkpoint('a failed Hero video leaves the poster visible after the introduction',async()=>{
  const {context,page}=await open();await context.route('**/film.webm',route=>route.abort());await go(page);await settled(page)
  await expect(page.locator('[data-playback="hero-cycle"] img')).toBeVisible();await expect(page.locator('[data-playback="hero-cycle"]')).toHaveAttribute('data-media-state','error');await context.close()
 })
 }
 expect(report.errors).toEqual([])
}catch(error){report.failure=error.message;report.failureState=await Promise.all(browser.contexts().flatMap(c=>c.pages()).map(p=>p.evaluate(()=>({url:location.href,states:window.entranceQA?.states,hydrated:document.querySelector('[data-studio-hydrated]')?.getAttribute('data-studio-hydrated')})).catch(()=>null)));console.error(error.message.split('Call log:')[0]);process.exitCode=1}
finally{
 await browser.close();await reset()
 await mkdir('artifacts/entrance-restoration/after',{recursive:true})
 await cp(out,'artifacts/entrance-restoration/after',{recursive:true})
 report.finished=new Date().toISOString()
 await writeFile(`artifacts/entrance-restoration/${realMedia?'real-media-checks':'browser-checks'}.json`,JSON.stringify(report,null,2))
 console.log(`${report.checks.length} groups passed; ${report.errors.length} page errors`)
}
