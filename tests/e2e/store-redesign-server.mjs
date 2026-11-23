// Local replay of public GET snapshots. Writes below affect memory only.
import http from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
const root = new URL('../../artifacts/store-redesign/before/', import.meta.url)
const read = name => JSON.parse(readFileSync(new URL(name+'.json',root),'utf8'))
const originalStudio=read('studio'), originalConfig=read('config'), categories=read('categories')
const list=read('products').items
const products=list.map(p=>read('product-'+p.slug))
let overrides={},wishlist=[]
const records=[]
const port=Number(process.env.STORE_TEST_PORT||49171)
const origin=`http://127.0.0.1:${port}`
const copy = value => structuredClone(value)
const server=http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','*');res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS')
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return}
  const url=new URL(req.url,origin),p=url.pathname.replace(/^\/api\/core/,'').replace(/\/$/,'')
  const send=(body,status=200)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(body))}
  let body={};if(req.method==='POST'){const chunks=[];for await(const c of req)chunks.push(c);try{body=JSON.parse(Buffer.concat(chunks))}catch{}}
  if(p==='/health')return send({fixture:true})
  if(p==='/__test/reset'){overrides={};wishlist=[];records.length=0;return send({fixture:true})}
  if(p==='/__test/state'&&req.method==='POST'){overrides={...overrides,...body};return send({fixture:true})}
  if(p==='/__test/records')return send(records)
  if(p==='/film.webm'&&process.env.STORE_TEST_VIDEO){const data=readFileSync(process.env.STORE_TEST_VIDEO);res.writeHead(200,{'Content-Type':'video/webm','Content-Length':data.length});res.end(data);return}
  if(p==='/storefront/config')return send({...originalConfig,domain:'fixture.local',public_url:'https://fixture.local/',store_id:'s_1234567890abcdef',configuration_source:'platform',frontend_type:'custom',store_open:true,store_domain_revision:1,feature_flags:{...originalConfig.feature_flags,reviews:false,loyalty:false}})
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
  if(p==='/catalog/categories')return send(categories)
  if(p==='/catalog/products'){
    // Force more than one API page, with the hoodie on the last page.
    let items=[...list].sort((a,b)=>Number(a.slug.includes('ombra'))-Number(b.slug.includes('ombra')))
    if(url.searchParams.has('product_kind')) items=items.filter(x=>x.product_kind===url.searchParams.get('product_kind'))
    const q=url.searchParams.get('q')?.toLowerCase(); if(q)items=items.filter(x=>x.name.toLowerCase().includes(q)||x.slug.includes(q))
    if(overrides.empty)items=[]
    const page=Number(url.searchParams.get('page')||1),size=2
    return send({items:items.slice((page-1)*size,page*size),page,page_size:size,total:items.length,pages:Math.ceil(items.length/size),has_next:page*size<items.length,has_prev:page>1})
  }
  if(p.startsWith('/catalog/products/')){
    const id=decodeURIComponent(p.split('/').at(-1)),original=products.find(x=>x.slug===id||x.id===id)
    if(!original)return send({detail:'Not found'},404)
    const product=copy(original)
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
