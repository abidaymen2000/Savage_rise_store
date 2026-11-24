import type { Product, Variant } from '@/types/api'
import type { StudioHeroAction, StudioManifest } from '@/lib/studio-contract'
import { getProductAvailability, getSelectableQuantityLimit } from '@/lib/inventory'
import { availabilityLabel } from '@/lib/availability'
import { declaredStoreConfig } from '@/lib/store-contract'

export function heroHref(action: StudioHeroAction, manifest: StudioManifest, visibility: Record<string,boolean> = {}) {
  const allowed=manifest.hero_actions
  if(allowed?.version!==1||!allowed.types.includes(action.type))throw Error("This destination is unavailable in this store.")
  if(action.type==='page'){
    const page=manifest.pages.find(p=>p.key===action.target)
    if(!page||!allowed.pages.includes(page.key)||visibility[page.key]===false)throw Error("This page is no longer available.")
    return page.path
  }
  if(action.type==='section'){
    const section=allowed.sections.find(s=>s.key===action.target)
    if(!section)throw Error("This section is no longer available.")
    return section.path
  }
  if(action.type==='product'||action.type==='buy_product'){
    if(!action.product_id?.trim())throw Error("This product is no longer available in this store.")
    return '/products/'+encodeURIComponent(action.product_id)
  }
  return null
}
export type HeroSelection={key:string;variant:Variant;size:string;label:string;limit:number}
export function heroSelections(product: Product):HeroSelection[]{
  return product.variants.flatMap(variant=>variant.sizes.map(size=>({key:(size.variant_item_id||variant.id||'')+':'+size.size,variant,size:size.size,
    label:[variant.name||variant.color,size.size].filter(v=>v&&!['default','__default__'].includes(v.toLowerCase())).filter((v,i,a)=>a.indexOf(v)===i).join(' / ')||"Single Option",
    limit:getSelectableQuantityLimit(size)})))
}
export function automaticHeroSelection(product: Product):HeroSelection|null{
  const choices=heroSelections(product)
  const axes=(product.option_axes||[]).filter(axis=>!['default','__default__'].includes(String(axis).toLowerCase()))
  const options=product.variants.some(v=>Object.entries(v.option_values||{}).some(([key,value])=>![key,value].some(x=>['default','__default__'].includes(x.toLowerCase()))))
  return !axes.length&&!options&&choices.length===1&&choices[0].limit>0?choices[0]:null
}
export async function readHeroProduct(id:string, source:{getProduct:(id:string)=>Promise<Product>;getStoreConfig:()=>Promise<unknown>}){
  const [product,rawConfig]=await Promise.all([source.getProduct(id),source.getStoreConfig()])
  const config=declaredStoreConfig(rawConfig)
  if(!config.store_open||config.status!=='active')throw Error("The store is currently closed.")
  if(product.id!==id)throw Error("This product is no longer available in this store.")
  const status=getProductAvailability(product)
  if(status!=='available')throw Error(status==='unknown'?"Availability could not be confirmed. Please try again.":availabilityLabel(status)+"— this product cannot be ordered right now.")
  return {product,currency:config.default_currency}
}
