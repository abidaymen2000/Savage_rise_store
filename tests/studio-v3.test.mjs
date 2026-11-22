import assert from 'node:assert/strict'
import test from 'node:test'
import { hiddenPath, studioStyles, validStudioContent } from '../lib/studio-contract.ts'

test('visibility hides a route and its descendants while keeping neighboring routes', () => {
  for (const route of ['/packs','/packs/','/packs?sort=new','/packs/box#details']) assert.equal(hiddenPath(route,['/packs']),true)
  for (const route of ['/packs-new','/products','/checkout','/checkout/success']) assert.equal(hiddenPath(route,['/packs']),false)
})
test('only declared typography roles and allowlisted families create styles', () => {
  const content = { typography: { heading:'tahoma', body:'serif', button:'url(javascript:bad)', margin:'sans' } }
  assert.deepEqual(studioStyles(content), {'--studio-font-heading':'Tahoma, Arial, sans-serif','--studio-font-body':'Georgia, Tahoma, serif'})
  assert.deepEqual(studioStyles({typography:{body:'default'}}),{})
})
test('preview messages retain template and contract scope', () => {
  const content={template_id:'savage-rise',contract_version:3,hero:{title:'Texte — أهلاً'},visibility:{},typography:{},grids:{}}
  assert.equal(validStudioContent(content,'savage-rise'),true)
  assert.equal(validStudioContent(content,'yovoflow-standard'),false)
  assert.equal(validStudioContent({...content,contract_version:2},'savage-rise'),false)
  assert.equal(validStudioContent(null,'savage-rise'),false)
})

// Execute the real middleware with isolated transport and Next response adapters.
// This is a module contract test, not a browser or a deployed HTTP request.
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

test('optional public routes fail closed and mandatory commerce remains routable', async () => {
  const standard = readFileSync(new URL('../middleware.ts',import.meta.url),'utf8').includes('x-yovo-store-id')
  let hidden=['/about'], code=200, calls=0
  class Reply extends Response { static next(){return new Reply(null)}; static redirect(url,status){return new Reply(null,{status,headers:{Location:String(url)}})} }
  const mod={exports:{}}
  runInNewContext(ts.transpileModule(readFileSync(new URL('../middleware.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText, {
    exports:mod.exports, URL, Headers, Response, AbortSignal, process:{env:{}},
    fetch:async()=>{calls++;return Response.json({hidden_paths:hidden},{status:code})},
    require(name){
      if(name==='next/server')return {NextResponse:Reply}
      if(name.includes('gateway-config'))return {getCoreApiBaseUrl:()=> 'http://fixture',getApiBaseUrl:()=> 'http://fixture',getStorefrontHeaders:()=>({})}
      if(name.endsWith('studio-contract'))return {hiddenPath}
      if(name.endsWith('preview-access'))return {previewFrameAncestors:()=> "frame-ancestors 'self'"}
      if(name.endsWith('store-contract'))return {declaredStoreConfig:()=>({})}
      throw Error('Unexpected middleware dependency '+name)
    }
  })
  const request=path=>{const url=new URL('http://localhost'+(standard?'/s_0000000000000001':'')+path);return {nextUrl:{pathname:url.pathname,clone:()=>new URL(url)},headers:new Headers({host:'localhost'}),cookies:{get:()=>undefined,has:()=>false}}}
  for(const path of ['/about','/vlog','/contact','/help','/size-guide','/shipping','/returns','/packs','/pages/legacy']){
    hidden=[path];code=200
    assert.equal((await mod.exports.middleware(request(path))).status,404,path)
    assert.equal((await mod.exports.middleware(request(path+'/child'))).status,404,path+' child')
  }
  hidden=[];code=503
  assert.equal((await mod.exports.middleware(request('/about'))).status,503)
  calls=0
  for(const path of ['/products','/checkout','/checkout/success','/cart']) assert.equal((await mod.exports.middleware(request(path))).status,200,path)
  assert.equal(calls,0)
})
