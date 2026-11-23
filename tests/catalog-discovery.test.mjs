import test from 'node:test'
import assert from 'node:assert/strict'
import { getHomepageCategories, getCatalogCategoryOptions } from '@/lib/storefront/catalog'
import { loadCatalogProducts } from '@/lib/storefront/catalog-data'

const category=(id,parent_id=null,status='active')=>({id,slug:id,name:id,parent_id,status})
const product=(id,category_id)=>({id,name:id,product_kind:'physical',category_ids:[category_id],variants:[]})
test('homepage discovers every eligible department, including grandchildren and sold-out pieces',()=>{
  const categories=[category('clothing'),category('hoodies','clothing'),category('pants','clothing'),category('baggy','pants'),category('tees','clothing'),category('oversize','tees'),category('future','clothing'),category('empty','clothing'),category('hidden','clothing','inactive')]
  const products=[product('hoodie','hoodies'),product('pants','baggy'),{...product('tee','oversize'),in_stock:false},product('future','future'),product('hidden','hidden')]
  assert.deepEqual(getHomepageCategories(categories,products).map(c=>c.key),['hoodies','pants','tees','future'])
  assert.equal(getHomepageCategories(categories,products)[0].image,null)
  assert.deepEqual(getHomepageCategories(categories,[]),[])
  assert.deepEqual(getCatalogCategoryOptions(categories).filter(c=>c.depth===2).map(c=>c.value),['baggy','oversize'])
})
test('catalog traverses server-clamped pages without losing the final hoodie or search query',async()=>{
  const calls=[]
  const products=await loadCatalogProducts(async(skip,limit,query)=>{
    calls.push({skip,limit,query})
    const page=skip/2+1
    return {items:page===3?[product('hoodie','hoodies')]:[product('item'+skip,'tees'),product('item'+(skip+1),'tees')],page,page_size:2,total:5,pages:3,has_next:page<3}
  },{productKind:'physical',q:'SR'})
  assert.equal(products.length,5)
  assert.equal(products.at(-1).id,'hoodie')
  assert.deepEqual(calls.map(c=>c.skip),[0,2,4])
  assert.deepEqual(calls.map(c=>c.limit),[100,2,2])
  assert.ok(calls.every(c=>c.query.productKind==='physical'&&c.query.q==='SR'))
})
test('repeated pagination fails visibly instead of hiding eligible products',async()=>{
  await assert.rejects(()=>loadCatalogProducts(async()=>({items:[product('same','tees')],page:1,page_size:1,total:2,pages:2,has_next:true})),/entièrement/)
})
