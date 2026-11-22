import test from "node:test"
import assert from "node:assert/strict"
import { pricingKey, pricingInput, confirmCheckout } from "../lib/checkout-flow.ts"
import { saveQuickPurchase, readQuickPurchase, removeQuickPurchase } from "../lib/quick-purchase.ts"

const payload = {items: [{product_id:"p",variant_id:"black-m",qty:1}], shipping: {country:"TN",city:"",full_name:"",phone:"",postal_code:"",address_line1:""}, payment_method:"cod"}
const q = (total=87.9, extra={}) => ({currency:"TND",total,subtotal:79.9,shipping_amount:8,quote_token:"signed",quote_expires_at:Date.now()/1000+900,...extra})
test("quote input is immediately available with every address field empty",()=>{
 const empty = pricingInput(payload)
 assert.equal(empty.shipping.country,"")
 assert.equal(empty.shipping.city,"")
 assert.equal(empty.shipping.postal_code,"")
 assert.equal(empty.shipping.address_line1,"")
 assert.deepEqual(empty.items,payload.items)
 assert.equal(payload.shipping.country,"TN")
})
test("all delivery edits reuse the quote; quantities, selections and discounts invalidate it",()=>{
 for(const shipping of [{...payload.shipping,country:"FR"},{...payload.shipping,city:"Paris"},{...payload.shipping,postal_code:"75001"},{...payload.shipping,address_line1:"New street"},{...payload.shipping,full_name:"Test",phone:"000"}]) {
   assert.equal(pricingKey(payload),pricingKey({...payload,shipping}))
   assert.deepEqual(pricingInput(payload),pricingInput({...payload,shipping}))
 }
 for(const next of [{...payload,items:[{...payload.items[0],qty:2}]},{...payload,items:[{...payload.items[0],variant_id:"black-l"}]},{...payload,promo_code:"TEST"},{...payload,loyalty_points_to_use:10}])
   assert.notEqual(pricingKey(payload),pricingKey(next))
})
test("unchanged valid quote confirms once with same selected variant",async()=>{
 let sends=0
 const result=await confirmCheckout({payload,quote:q(),currency:"TND",idempotencyKey:"intent-1",load:async()=>{throw Error("unnecessary quote")},submit:async(body,key)=>{sends++;assert.equal(key,"intent-1");assert.equal(body.items[0].variant_id,"black-m");assert.equal(body.quote_token,"signed");return{id:"order-1"}}})
 assert.equal(result.kind,"confirmed");assert.equal(sends,1)
})
test("missing quote prepares total and requires Commander again",async()=>{
 let sends=0
 const options={payload,quote:null,preparedQuote:q(),currency:"TND",idempotencyKey:"intent-2",load:async()=>{throw Error("duplicate quote")},submit:async()=>{sends++;return{id:"one"}}}
 const review=await confirmCheckout(options)
 assert.equal(review.kind,"review");assert.equal(sends,0)
 assert.equal((await confirmCheckout({...options,quote:review.quote})).kind,"confirmed")
 assert.equal(sends,1)
})
test("expired quote with a changed price requires explicit second confirmation",async()=>{
 let sends=0
 const options={payload,quote:q(87.9,{quote_expires_at:1}),currency:"TND",idempotencyKey:"intent-3",load:async()=>q(90),submit:async()=>{sends++;return{id:"one"}}}
 const result=await confirmCheckout(options)
 assert.equal(result.kind,"review");assert.equal(result.quote.total,90);assert.equal(sends,0)
 await confirmCheckout({...options,quote:result.quote});assert.equal(sends,1)
})
test("final quote conflict never submits a changed price without review",async()=>{
 let attempts=0
 const result=await confirmCheckout({payload,quote:q(),currency:"TND",idempotencyKey:"intent-4",load:async()=>q(99),submit:async()=>{attempts++;throw {status:409,body:{detail:{code:"QUOTE_CHANGED"}}}}})
 assert.equal(result.kind,"review");assert.equal(attempts,1)
})
test("network loss resumes the identical command and idempotency key",async()=>{
 const commands=[]
 const result=await confirmCheckout({payload,quote:q(),currency:"TND",idempotencyKey:"intent-5",load:async()=>q(),submit:async(body,key)=>{commands.push({body,key});if(commands.length===1)throw new TypeError("network");return{id:"one"}}})
 assert.equal(result.kind,"confirmed");assert.equal(commands.length,2);assert.deepEqual(commands[0],commands[1])
})
test("unavailable stock is permanent; bounded failures never fabricate a successful order",async()=>{
 let attempts=0
 await assert.rejects(confirmCheckout({payload,quote:q(),currency:"TND",idempotencyKey:"intent-6",load:async()=>q(),submit:async()=>{attempts++;throw {status:409,code:"INSUFFICIENT_STOCK"}}}))
 assert.equal(attempts,1)
 let reads=0
 await assert.rejects(confirmCheckout({payload,quote:null,currency:"TND",idempotencyKey:"intent-7",load:async()=>{reads++;throw {status:503}},submit:async()=>{throw Error("must not submit")}}))
 assert.equal(reads,3)
})
test("quick intent preserves existing cart, exact variant/quantity and pack selections",()=>{
 const map=new Map([["regular-cart",JSON.stringify({items:["unrelated"]})]])
 const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)}
 const original=map.get("regular-cart")
 const state={items:[{product:{id:"p"},selectedVariantItemId:"black-m",quantity:2}],packItems:[{pack:{id:"bundle"},selections:[{component_id:"c",variant_item_id:"black-l"}],quantity:1}],total:125.8,itemCount:3}
 const intent=saveQuickPurchase(storage,"store-a",state,"/products/p?variant=black-m&qty=2",100)
 assert.deepEqual(readQuickPurchase(storage,"store-a",intent.id,101).state,state)
 assert.equal(readQuickPurchase(storage,"store-b",intent.id,101),null)
 assert.equal(readQuickPurchase(storage,"store-a",intent.id,100+7200000),null)
 removeQuickPurchase(storage,"store-a",intent.id)
 assert.equal(map.get("regular-cart"),original);assert.equal(readQuickPurchase(storage,"store-a",intent.id,101),null)
})


test("bundle checkout preserves every canonical component variant and parent", async()=>{
 const {buildOrderPayload} = await import("../lib/order-payload.ts")
 const result=buildOrderPayload({items:[],packItems:[{pack:{id:"bundle",variant_id:"parent-canonical"},quantity:1,selections:[{component_id:"c",product_id:"p",variant_id:"legacy-color-group",variant_item_id:"canonical-black-m",color:"Black",size:"M"}]}],shipping:payload.shipping})
 assert.equal(result.items[0].variant_id,"parent-canonical")
 assert.deepEqual(result.items[0].bundle_selection.components,[{component_id:"c",variant_id:"canonical-black-m"}])
})

test("old signed quote recovers automatically at the same total with one order intention",async()=>{
 const sends=[]
 const full={...payload,shipping:{...payload.shipping,country:"FR",city:"Paris",address_line1:"Fixture",postal_code:"75001"}}
 const result=await confirmCheckout({payload:full,quote:q(),currency:"TND",idempotencyKey:"rolling-release",
   load:async()=>q(87.9,{quote_token:"new-signature"}),
   submit:async(body,key)=>{sends.push({body,key});if(sends.length===1)throw {status:409,body:{detail:{code:"QUOTE_CHANGED"}}};return{id:"one"}}})
 assert.equal(result.kind,"confirmed")
 assert.equal(sends.length,2)
 assert.equal(sends[0].key,sends[1].key)
 assert.deepEqual(sends[1].body.shipping,full.shipping)
 assert.equal(sends[1].body.quote_token,"new-signature")
})
