import { writeFile } from 'node:fs/promises'
const base='http://127.0.0.1:49176', fixture='http://127.0.0.1:49175'
const out=process.env.PERF_DATA_OUTPUT
if(!out)throw Error('PERF_DATA_OUTPUT is required')
await fetch(fixture+'/__test/reset',{method:'POST'})
await fetch(fixture+'/__test/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({compact:true,pageSize:100,delayMs:1000})})
const paths=['/','/products','/products/sr-ombra-oversized-hoodie','/products/6b032d527b49ec9b6c39ec4d']
for(const path of paths){const r=await fetch(base+path);await r.arrayBuffer();if(!r.ok)throw Error(`Warmup ${path}: ${r.status}`)}
const results=[]
for(let sample=1;sample<=3;sample++)for(const path of paths){
  const index=(await(await fetch(fixture+'/__test/metrics')).json()).length
  const start=performance.now(),response=await fetch(base+path),ttfb=performance.now()-start
  const html=await response.text(),ms=performance.now()-start
  const calls=(await(await fetch(fixture+'/__test/metrics')).json()).slice(index)
  const r={sample,path,status:response.status,ttfb,fullDataMs:ms,htmlBytes:Buffer.byteLength(html),cards:(html.match(/<article class="store-product-card/g)||[]).length,apiCount:calls.length,productReads:calls.filter(c=>c.path.startsWith('/catalog/products')).length,calls}
  results.push(r);await writeFile(out,JSON.stringify({kind:'controlled local Next dev; same public snapshots; 1000 ms/catalogue request; no browser',results},null,2));console.log(JSON.stringify({...r,calls:undefined}))
}
