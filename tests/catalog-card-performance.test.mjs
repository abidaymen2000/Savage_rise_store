import test from 'node:test'
import assert from 'node:assert/strict'
import { catalogCardDetail } from '../lib/catalog-card-detail.ts'
import { catalogOptionDisplay } from '../lib/catalog-option-display.ts'
import { catalogApi } from '../lib/api/catalog-api.ts'
import { CatalogService } from '../lib/api/api-client.ts'
import { getProductColorSlides } from '../lib/product-color-media.ts'
import { getColorSwatch } from '../lib/color-swatches.ts'

const sizes = ['XS', 'S', 'M', 'L', 'XL']
const item = () => ({
  id:'product',slug:'product',name:'Published product',version:1,product_kind:'physical',status:'active',default_currency:'TND',
  primary_category_id:'hoodies',category_ids:['hoodies','collection'],description:'Published description',in_stock:true,availability_status:'available',min_price:89.9,
  option_axes:[{code:'color',values:[{id:'canonical-color',code:'black',label:'Black'}]}],
  variant_count:5,variant_summary:sizes.map((size,position)=>({id:'v-'+size,title:'Legacy title',sku:'HISTORICAL-DARK-BLACK-'+size,position,status:'active',track_inventory:true,
    option_values:{color:'black',size},option_value_labels:{color:'obsolete',size},base_price:89.9,in_stock:true,availability_status:'available',
    primary_image:{asset_id:'black-photo',url:'https://cdn.example.invalid/black.jpg',is_primary:true},
  })),
})

test('canonical color identity wins over obsolete labels and historical SKUs for all five sizes',()=>{
  for(const row of item().variant_summary){
    const before=structuredClone(row),display=catalogOptionDisplay(row,item().option_axes)
    assert.equal(display.color.label,'Black');assert.equal(display.color.value,'black')
    assert.equal(getColorSwatch(display.color.swatch||display.color.value),'#111111')
    assert.deepEqual(row,before)
  }
})

test('complete public card projection replaces N detail reads without losing SKU, categories, price, color media or availability',async()=>{
  const originals=[CatalogService.listProductsCatalogProductsGet,CatalogService.getProductCatalogProductsSlugGet]
  let reads=0,detailReads=0
  const source=item(),before=structuredClone(source)
  CatalogService.listProductsCatalogProductsGet=async query=>{reads++;assert.deepEqual(query.include,['variant_summary']);return{items:[source],total:1,page:1,page_size:100,pages:1,has_next:false}}
  CatalogService.getProductCatalogProductsSlugGet=async()=>{detailReads++;throw Error('unnecessary detail')}
  try{
    const [product]=(await catalogApi.getProductCardsPage(0,100)).items
    assert.equal(reads,1);assert.equal(detailReads,0)
    assert.deepEqual(product.category_ids,['hoodies','collection']);assert.equal(product.description,source.description)
    assert.equal(product.price,89.9);assert.equal(product.in_stock,true)
    assert.deepEqual(product.variants.map(v=>v.sku),sizes.map(s=>'HISTORICAL-DARK-BLACK-'+s))
    assert.deepEqual(product.variants.map(v=>v.sizes[0].size),sizes)
    assert.ok(product.variants.every(v=>v.color==='Black'&&v.sizes[0].in_stock===true))
    assert.equal(getProductColorSlides(product).length,1)
    assert.equal(getProductColorSlides(product)[0].url,source.variant_summary[0].primary_image.url)
    assert.deepEqual(source,before)
  }finally{[CatalogService.listProductsCatalogProductsGet,CatalogService.getProductCatalogProductsSlugGet]=originals}
})

test('older Core contract falls back to complete details; no invented category memberships or SKUs',()=>{
  for(const mutate of [p=>delete p.category_ids,p=>p.variant_summary=null,p=>delete p.variant_summary[0].sku,p=>{p.variant_summary=[];p.variant_count=0;p.min_price=null}]){
    const p=item();mutate(p);assert.equal(catalogCardDetail(p),null)
  }
})

test('incomplete, duplicate, corrupt or unpriced summaries are rejected as integrity errors',()=>{
  for(const mutate of [p=>p.variant_summary.pop(),p=>p.variant_summary[1].id=p.variant_summary[0].id,p=>p.variant_summary[0].base_price=null,p=>p.variant_summary[0].base_price=false,p=>p.variant_summary={},p=>p.variant_summary=[null],p=>p.category_ids=[null],p=>p.variant_summary[0].in_stock=undefined]){
    const p=item();mutate(p);assert.throws(()=>catalogCardDetail(p),{reason:'invalid_card_summary'})
  }
})

test('zero prices and manual sold-out remain truthful in card projections',()=>{
  const p=item();p.min_price=0;p.in_stock=false;p.forced_sold_out=true;p.availability_status='forced_sold_out'
  p.variant_summary.forEach(v=>{v.base_price=0;v.in_stock=false;v.availability_status='forced_sold_out'})
  const detail=catalogCardDetail(p);assert.equal(detail.in_stock,false);assert.equal(detail.forced_sold_out,true)
  assert.ok(detail.variants.every(v=>v.base_price==='0'&&v.inventory.availability_status==='forced_sold_out'))
})
