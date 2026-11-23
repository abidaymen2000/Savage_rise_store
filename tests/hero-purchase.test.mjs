import test from 'node:test'
import assert from 'node:assert/strict'
import {automaticHeroSelection,heroSelections,readHeroProduct,heroHref} from '../lib/hero-purchase.ts'
import {saveQuickPurchase,readQuickPurchase} from '../lib/quick-purchase.ts'
const variant=(id,size,state='available',price=79.9)=>({id,name:'Black',color:'Black',option_values:{color:'Black',size},sizes:[{size,variant_item_id:id,availability_status:state,in_stock:state==='available'}],images:[],price})
const product={id:'a'.repeat(24),name:'Pantalon',price:79.9,product_kind:'physical',option_axes:['color','size'],availability_status:'available',variants:[variant('black-m','M'),variant('black-s','S','out_of_stock')]}
const config={configuration_source:'platform',frontend_type:'standard',store_id:'s_0123456789abcdef',store_domain_revision:1,store_open:true,default_currency:'TND',domain:null,status:'active'}
const source=(p=product,c=config)=>({getProduct:async()=>p,getStoreConfig:async()=>c})
test('variants always require an explicit choice even if only one is available',()=>{
 assert.equal(automaticHeroSelection(product),null)
 assert.equal(automaticHeroSelection({...product,variants:[product.variants[0]]}),null)
 const rows=heroSelections(product);assert.equal(rows[0].limit,99);assert.equal(rows[1].limit,0)
 assert.match(rows[0].label,/Black.*M/)
})
test('simple product can buy its sole model without arbitrary size selection',()=>{
 const simple={...product,option_axes:[],variants:[{...variant('unique','default'),option_values:{}}]}
 assert.equal(automaticHeroSelection(simple).key,'unique:default')
 assert.equal(automaticHeroSelection({...simple,availability_status:'out_of_stock',variants:[{...simple.variants[0],sizes:[{size:'default',availability_status:'out_of_stock'}]}]}),null)
})
test('click reads current price and configuration; closed, forced, inactive and unknown reject',async()=>{
 assert.equal((await readHeroProduct(product.id,source({...product,price:91.999}))).product.price,91.999)
 for(const state of ['forced_sold_out','out_of_stock','inactive','unknown'])await assert.rejects(readHeroProduct(product.id,source({...product,availability_status:state,in_stock:false})))
 await assert.rejects(readHeroProduct(product.id,source(product,{...config,store_open:false})),/currently closed/)
 await assert.rejects(readHeroProduct('b'.repeat(24),source()),/no longer available/)
 await assert.rejects(readHeroProduct(product.id,{...source(),getProduct:async()=>{throw Object.assign(Error('retiré'),{status:404})}}),/retiré/)
})
test('template declares page and section choices; hidden and unimplemented destinations reject',()=>{
 const manifest={pages:[{key:'products',path:'/products'}],hero_actions:{version:1,types:['buy_product','product','page','section'],pages:['products'],sections:[{key:'catalog',path:'/#studio-catalog'}]}}
 assert.equal(heroHref({type:'page',target:'products'},manifest),'/products')
 assert.equal(heroHref({type:'section',target:'catalog'},manifest),'/#studio-catalog')
 assert.throws(()=>heroHref({type:'page',target:'checkout'},manifest))
 assert.throws(()=>heroHref({type:'page',target:'products'},manifest,{products:false}))
 assert.throws(()=>heroHref({type:'buy_product',product_id:product.id},{pages:[]}))
})
test('Hero quick purchase preserves normal cart and canonical chosen variant',()=>{
 const saved=new Map([['cart','existing regular cart']]),storage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)}
 const chosen=heroSelections(product)[0]
 const state={items:[{product,selectedVariant:chosen.variant,selectedSize:chosen.size,selectedVariantItemId:chosen.variant.id,quantity:2}],packItems:[],total:159.8,itemCount:2}
 const receipt=saveQuickPurchase(storage,'company-a',state,'/products/pantalon?variant=black-m&qty=2')
 assert.equal(saved.get('cart'),'existing regular cart')
 assert.equal(readQuickPurchase(storage,'company-a',receipt.id).state.items[0].selectedVariantItemId,'black-m')
 assert.equal(readQuickPurchase(storage,'company-b',receipt.id),null)
})
