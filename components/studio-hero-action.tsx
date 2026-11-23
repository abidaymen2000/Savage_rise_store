"use client"
import {useEffect,useRef,useState} from 'react'
import {api} from '@/lib/api'
import {useCart} from '@/contexts/CartContext'
import {useStudio} from '@/components/studio-runtime'
import {useHeroNavigation} from '@/components/hero-navigation'
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {heroHref,heroSelections,automaticHeroSelection,readHeroProduct} from '@/lib/hero-purchase'
import type {StudioHeroAction} from '@/lib/studio-contract'
import type {Product} from '@/types/api'

export function StudioHeroAction({action,label,className}:{action:StudioHeroAction;label:string;className?:string}){
 const studio=useStudio(),navigation=useHeroNavigation(),{buyNow}=useCart()
 const [product,setProduct]=useState<Product|null>(null),[currency,setCurrency]=useState(''),[choice,setChoice]=useState(''),[quantity,setQuantity]=useState(1)
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[open,setOpen]=useState(false)
 const locked=useRef(false),generation=useRef(0)
 useEffect(()=>{generation.current++;setOpen(false);setProduct(null);setChoice('');setError('');return()=>{generation.current++}},[action])
 const selections=product?heroSelections(product):[],selected=selections.find(s=>s.key===choice)
 const price=selected?.variant.price??product?.price
 const money=(value:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:currency||'TND'}).format(value)
 async function run(confirm=false){
  if(locked.current)return
  locked.current=true;setBusy(true);setError('');const turn=++generation.current
  try{
   if(!studio.manifest)throw Error("This destination could not be verified. Please try again.")
   const href=heroHref(action,studio.manifest,studio.content?.visibility)
   if(href){navigation.push(href);return}
   if(action.type!=='product'&&action.type!=='buy_product')return
   if(studio.preview)throw Error("Purchases are disabled in this private preview.")
   const fresh=await readHeroProduct(action.product_id,api)
   if(turn!==generation.current)return
   setProduct(fresh.product);setCurrency(fresh.currency)
   const path=(fresh.product.product_kind==='bundle'?'/packs/':'/products/')+encodeURIComponent(fresh.product.slug||fresh.product.id)
   if(action.type==='product'){navigation.push(path);return}
   if(!studio.manifest.hero_actions?.product_kinds.includes(fresh.product.product_kind||''))throw Error("Open the product page to purchase this item.")
   const selection=confirm?heroSelections(fresh.product).find(s=>s.key===choice):automaticHeroSelection(fresh.product)
   if(!selection){if(confirm)throw Error("Select an available option.");setChoice('');setQuantity(1);setOpen(true);return}
   const qty=confirm?quantity:1
   if(!Number.isInteger(qty)||qty<1||qty>selection.limit)throw Error("This option or quantity is no longer available. Select another option.")
   buyNow({...fresh.product,price:selection.variant.price??fresh.product.price},selection.variant,selection.size,qty,navigation.href(path))
   setOpen(false)
  }catch(e){if(turn===generation.current)setError((e as {status?:number})?.status===404?"This product is no longer available in this store.":e instanceof Error?e.message:"This product could not be verified. Please try again.")}
  finally{locked.current=false;setBusy(false)}
 }
 return <><div className="flex flex-col gap-2"><button type="button" className={className} disabled={busy} aria-busy={busy} onClick={()=>void run()}>{busy?"Checking…":label}</button>{error&&!open&&<p role="alert" className="max-w-sm text-sm">{error}</p>}</div>
 <Dialog open={open} onOpenChange={value=>{if(!value){generation.current++;setOpen(false)}}}><DialogContent className="max-h-[90dvh] overflow-y-auto bg-background text-foreground sm:max-w-lg"><DialogHeader><DialogTitle>{product?.name||"Select Your Options"}</DialogTitle><DialogDescription>Choose your options and quantity to check out directly. Your current bag will be saved.</DialogDescription></DialogHeader>
 {product&&<div className="space-y-4">{(selected?.variant.images[0]?.url||product.images?.[0]?.url)&&<img src={selected?.variant.images[0]?.url||product.images?.[0]?.url} alt="" className="mx-auto max-h-48 w-full rounded-lg object-contain"/>}
 <label className="block text-sm font-medium">Option<select className="mt-2 min-h-11 w-full rounded-lg border bg-background px-3" value={choice} disabled={busy} onChange={e=>{setChoice(e.target.value);setQuantity(1);setError('')}}><option value="">Select Color / Size</option>{selections.map(s=><option key={s.key} value={s.key} disabled={!s.limit}>{s.label}{!s.limit?' — indisponible':''}</option>)}</select></label>
 <label className="block text-sm font-medium">Quantity<input type="number" min={1} max={99} step={1} className="mt-2 min-h-11 w-full rounded-lg border bg-background px-3" value={quantity} disabled={busy} onChange={e=>setQuantity(e.target.valueAsNumber)}/></label>
 {typeof price==='number'&&<p className="text-lg font-semibold">{money(price)}</p>}
 {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
 <Button type="button" className="min-h-11 w-full" disabled={busy||!selected||selected.limit<1||!Number.isInteger(quantity)||quantity<1} onClick={()=>void run(true)}>{busy?"Checking…":"Shop Now"}</Button>
 </div>}</DialogContent></Dialog></>
}
