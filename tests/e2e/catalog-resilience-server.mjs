// Local replay of public GET snapshots. Writes below affect memory only.
import http from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
const root = new URL(process.env.CATALOG_FIXTURE_URL || '../../artifacts/store-redesign/before/', import.meta.url)
const read = name => JSON.parse(readFileSync(new URL(name+'.json',root),'utf8'))
const originalStudio=read('studio'), originalConfig=read('config'), categories=read('categories')
const list=read('products').items
const products=list.map(p=>read('product-'+p.slug))
let overrides={},wishlist=[],counters={}
const records=[]
const metrics=[]
const port=Number(process.env.STORE_TEST_PORT||49175)
const origin=`http://127.0.0.1:${port}`
const copy = value => structuredClone(value)
const server=http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','*');res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS')
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return}
  const url=new URL(req.url,origin),p=url.pathname.replace(/^\/api\/core/,'').replace(/\/$/,'')
  const send=(body,status=200)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'private, no-store'});res.end(JSON.stringify(body))}
  let body={};if(req.method==='POST'){const chunks=[];for await(const c of req)chunks.push(c);try{body=JSON.parse(Buffer.concat(chunks))}catch{}}
  if(p==='/health')return send({fixture:true})
  if(p==='/__test/reset'){overrides={};wishlist=[];records.length=0;counters={};return send({fixture:true})}
  if(p==='/__test/state'&&req.method==='POST'){overrides={...overrides,...body};return send({fixture:true})}
  if(p==='/__test/records')return send(records)
  if(p==='/__test/metrics')return send(metrics)
  const started=performance.now(),metric={path:p,query:url.search,method:req.method,at:Date.now()}
  metrics.push(metric);res.once('finish',()=>Object.assign(metric,{ms:performance.now()-started,status:res.statusCode}))
  counters[p]=(counters[p]||0)+1
  if(p.startsWith('/catalog/')&&overrides.delayMs)await new Promise(resolve=>setTimeout(resolve,overrides.delayMs))
  const catalogList=[...list],catalogDetails=[...products]
  for(let n=list.length;n<(overrides.count||0);n++){
    const item=copy(list[0]),detail=copy(products.find(p=>p.id===item.id))
    Object.assign(item,{id:'fixture-product-'+n,slug:'fixture-product-'+n,name:'Fixture product '+n})
    Object.assign(detail,{id:item.id,slug:item.slug,name:item.name})
    catalogList.push(item);catalogDetails.push(detail)
  }
  if(p==='/film.webm'&&process.env.STORE_TEST_VIDEO){const data=readFileSync(process.env.STORE_TEST_VIDEO);res.writeHead(200,{'Content-Type':'video/webm','Content-Length':data.length});res.end(data);return}
  if(p==='/storefront/config')return send({...originalConfig,domain:'savagerise.com',public_url:'https://savagerise.com/',store_id:'s_1234567890abcdef',configuration_source:'platform',frontend_type:'custom',store_open:true,store_domain_revision:1,feature_flags:{...originalConfig.feature_flags,reviews:false,loyalty:false}})
  if(p==='/storefront/studio'||p==='/storefront/studio/preview'){
    const document=copy(originalStudio)
    document.preview=p.endsWith('/preview');document.revision+=overrides.revision||0
    Object.assign(document.studio.hero,overrides.hero||{})
    if(document.preview)Object.assign(document.studio.hero,overrides.draftHero||{})
    document.studio.visibility={...document.studio.visibility,...overrides.visibility}
    document.studio.grids={...document.studio.grids,...overrides.grids}
    if(overrides.video&&process.env.STORE_TEST_VIDEO) document.studio.hero.media={url:origin+'/film.webm',mime:'video/webm',alt:'Vidéo de recette locale'}
    if(document.preview)document.preview_context={version:1,session_id:'a'.repeat(32),store_id:'s_1234567890abcdef',template_id:'savage-rise',draft_fingerprint:'b'.repeat(64),published_revision:document.revision}
    return send(document)
  }
  if(p==='/storefront/studio/visibility')return send({hidden_paths:overrides.hidden_paths||[]})
  if(p==='/catalog/categories'){records.push({path:p,mode:overrides.fault,at:Date.now(),tenant:req.headers['x-store-domain'],origin:req.headers.origin});if(overrides.fault==='categories-503'||overrides.fault==='categories-once'&&counters[p]===1)return send({detail:'Injected category error'},503);if(overrides.fault==='categories-timeout')return;return send(categories.filter(c=>!overrides.hiddenCategoryIds?.includes(c.id)))}
  if(p==='/catalog/products'){records.push({path:p,page:Number(url.searchParams.get('page')||1),mode:overrides.fault,at:Date.now(),tenant:req.headers['x-store-domain']});
    // Force more than one API page, with the hoodie on the last page.
    let items=catalogList.filter(x=>!overrides.hiddenIds?.includes(x.id)).sort((a,b)=>Number(a.slug.includes('ombra'))-Number(b.slug.includes('ombra')))
    if(url.searchParams.has('product_kind')) items=items.filter(x=>x.product_kind===url.searchParams.get('product_kind'))
    const q=url.searchParams.get('q')?.toLowerCase(); if(q)items=items.filter(x=>x.name.toLowerCase().includes(q)||x.slug.includes(q))
    if(overrides.empty)items=[]
    if(overrides.compact&&url.searchParams.getAll('include').includes('variant_summary'))items=items.map(item=>{
      const detail=catalogDetails.find(d=>d.id===item.id)
      const summaryPath=new URL('summary.json',root)
      const existing=existsSync(summaryPath)?read('summary').items.find(d=>d.id===item.id):null
      return {...item,category_ids:detail.category_ids||[],description:detail.description,
        variant_count:detail.variants.filter(v=>!v.archived_at).length,
        variant_summary:detail.variants.filter(v=>!v.archived_at).map(v=>({
          ...(existing?.variant_summary?.find(s=>s.id===v.id)||{id:v.id,title:v.title,option_values:v.option_values,option_value_labels:v.option_value_labels,base_price:Number(v.base_price),effective_price:v.effective_price==null?null:Number(v.effective_price),compare_at_price:v.compare_at_price==null?null:Number(v.compare_at_price),currency:v.currency,...v.inventory,primary_image:v.media?.find(m=>m.is_primary)||v.media?.[0]||null}),
          sku:v.sku??null,position:v.position||0,status:v.status||'active',track_inventory:v.inventory?.track_inventory??v.track_inventory??true,
          ...(overrides.soldOut?{in_stock:false,availability_status:'forced_sold_out'}:{}),
          ...(overrides.price?{base_price:overrides.price,effective_price:overrides.price}:{}),
        })),...(overrides.soldOut?{in_stock:false,forced_sold_out:true,availability_status:'forced_sold_out'}:{}),
      }
    })
    const page=Number(url.searchParams.get('page')||1),size=overrides.pageSize||2
    if(overrides.fault==='list-once'&&counters[p]===1)return send({detail:'Injected temporary list error'},503)
    if(overrides.fault==='short-200')return send({items:items.slice(0,-1),page:1,page_size:100,total:items.length,pages:1,has_next:false})
    if(overrides.fault==='page-503'&&page===2)return send({detail:'Injected page error'},503)
    if(overrides.fault==='total-change'&&page>1)return send({items:items.slice((page-1)*size,page*size),page,page_size:size,total:items.length+1,pages:Math.ceil((items.length+1)/size),has_next:page*size<items.length+1})
    if(overrides.fault==='repeat-final'&&page>1)return send({items:items.slice(0,items.length%size||size),page,page_size:size,total:items.length,pages:Math.ceil(items.length/size),has_next:page*size<items.length})
    if(overrides.fault==='missing-items')return send({page:1,page_size:100,total:items.length,pages:1,has_next:false})
    return send({items:items.slice((page-1)*size,page*size),page,page_size:size,total:items.length,pages:Math.ceil(items.length/size),has_next:page*size<items.length,has_prev:page>1})
  }
  if(p.startsWith('/catalog/products/')){
    const id=decodeURIComponent(p.split('/').at(-1)),original=catalogDetails.find(x=>x.slug===id||x.id===id)
    if(!original)return send({detail:'Not found'},404)
    records.push({path:p,mode:overrides.fault,at:Date.now(),tenant:req.headers['x-store-domain']})
    if(id===products[0].slug){
      if(overrides.fault==='detail-503'||overrides.fault==='detail-once'&&counters[p]===1)return send({detail:'Injected detail error'},503)
      if(overrides.fault==='detail-timeout')return
      if(overrides.fault==='detail-corrupt'){res.writeHead(200,{'Content-Type':'application/json'});return res.end('{"id":')}
    }
    const product=copy(original)
    if(overrides.fault==='kind-mismatch'&&id===products[0].slug)product.product_kind='bundle'
    if(overrides.soldOut){product.in_stock=false;product.forced_sold_out=true;product.availability_status='forced_sold_out'}
    if(overrides.price)product.variants.forEach(v=>{v.base_price=String(overrides.price);v.effective_price=String(overrides.price)})
    return send(product)
  }
  if(p==='/storefront/navigation')return send({menus:originalStudio.menus})
  if(p==='/storefront/vlog')return send(read('vlog'))
  if(p==='/storefront/drop-countdown')return send({is_active:false})
  if(p.startsWith('/storefront/pages/'))return send(originalStudio.pages.find(x=>x.slug===p.split('/').at(-1))||{detail:'Not found'})
  if(p==='/orders/quote'){
    records.push({path:p,body})
    const subtotal=(body.items||[]).reduce((sum,item)=>sum+89.9*item.qty,0)
    return send({currency:'TND',subtotal,total_amount:subtotal+8,total:subtotal+8,shipping_amount:8,shipping_rate_name:'Livraison de recette',promotion_discount:0,loyalty_discount:0,quote_token:'local-only-quote',quote_expires_at:Math.floor(Date.now()/1000)+300,warnings:[],items:body.items})
  }
  if(p==='/orders'&&req.method==='POST'){
    records.push({path:p,body,idempotency:req.headers['idempotency-key']})
    return send({id:'local-test-order',order_number:'LOCAL-001',status:'pending',payment_status:'pending',payment_method:'cod',total_amount:97.9,currency:'TND',items:body.items,shipping:body.shipping,created_at:new Date().toISOString()})
  }
  if(p==='/profile/me')return send({id:'test-user',email:'test@example.invalid',is_active:true,full_name:'Client de recette'})
  if(p.startsWith('/profile/wishlist')){records.push({path:p,method:req.method,body});if(req.method==='POST')wishlist.push({id:'test-wish',product_id:body.product_id});if(req.method==='DELETE')wishlist=wishlist.filter(x=>!p.endsWith(x.product_id));return send(req.method==='POST'?wishlist.at(-1):wishlist)}
  if(p.includes('reviews'))return send({items:[],total:0,average_rating:0})
  if(p.includes('analytics'))return send({tracked:true})
  return send({detail:'Unimplemented local fixture route: '+p},404)
})
server.listen(port,'127.0.0.1',()=>console.log('Snapshot fixture '+origin))


