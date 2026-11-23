import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { ENTRANCE_BOOTSTRAP } from '@/lib/storefront/entrance'

function run({visited=false,blocked=false,reduced=false}={}) {
  let now=0,id=0
  const root={dataset:{}},timers=new Map(),frames=new Map(),writes=[]
  function target(){const listeners=new Map();return {listeners,addEventListener:(type,fn)=>{if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn)},removeEventListener:(type,fn)=>listeners.get(type)?.delete(fn),dispatchEvent:event=>listeners.get(event.type)?.forEach(fn=>fn(event))}}
  const preference={...target(),matches:reduced},document={...target(),documentElement:root,querySelector:()=>null},window={...target(),matchMedia:()=>preference}
  const context={document,window,Element:class{},Event:class{constructor(type){this.type=type}},sessionStorage:{getItem:()=>{if(blocked)throw new Error('Disabled');return visited?'true':null},setItem:(...entry)=>{if(blocked)throw new Error('Disabled');writes.push(entry)}},setTimeout:(fn,delay)=>{timers.set(++id,{fn,time:now+delay});return id},clearTimeout:key=>timers.delete(key),requestAnimationFrame:fn=>{frames.set(++id,fn);return id},cancelAnimationFrame:key=>frames.delete(key)}
  vm.runInNewContext(ENTRANCE_BOOTSTRAP,context)
  const advance=ms=>{const end=now+ms;for(;;){const item=[...timers].sort((a,b)=>a[1].time-b[1].time)[0];if(!item||item[1].time>end)break;now=item[1].time;timers.delete(item[0]);item[1].fn()}now=end}
  const listenerCount=()=>[window,document,preference].reduce((n,t)=>n+[...t.listeners.values()].reduce((a,set)=>a+set.size,0),0)
  return {root,timers,frames,writes,advance,listenerCount,controller:window.__savageEntrance,preference}
}

test('returning session bypasses the introduction before paint',()=>{
  const result=run({visited:true})
  assert.equal(result.root.dataset.storeEntrance,'complete')
  assert.equal(result.timers.size,0)
  assert.equal(result.listenerCount(),0)
})
test('the complete introduction finishes without React chunks and releases every resource',()=>{
  const result=run()
  assert.equal(result.root.dataset.storeEntrance,'pending')
  result.advance(2800);assert.equal(result.root.dataset.storeEntrance,'revealing')
  result.advance(499);assert.equal(result.root.dataset.storeEntrance,'revealing')
  result.advance(1);assert.equal(result.root.dataset.storeEntrance,'complete')
  assert.deepEqual(result.writes,[['savage_rise_visited','true']])
  assert.equal(result.timers.size+result.frames.size+result.listenerCount(),0)
})
test('blocked session storage cannot leave the store inaccessible',()=>{
  const result=run({blocked:true});result.advance(3300)
  assert.equal(result.controller.stage,'complete')
  assert.equal(result.listenerCount(),0)
})
test('repeated skips do not restart the exit timer',()=>{
  const result=run();result.advance(150);result.controller.reveal();result.advance(300);result.controller.reveal();result.advance(200)
  assert.equal(result.controller.stage,'complete')
  assert.equal(result.timers.size,0)
})
test('reduced motion and a mid-sequence preference change use the minimal presentation',()=>{
  const minimal=run({reduced:true});minimal.advance(450);assert.equal(minimal.controller.stage,'complete')
  const changed=run();changed.advance(800);changed.preference.matches=true;changed.preference.dispatchEvent({type:'change'});changed.advance(450)
  assert.equal(changed.controller.stage,'complete')
  assert.equal(changed.listenerCount(),0)
})
