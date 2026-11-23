// Synthetic QA media only. Never a storefront asset or a production upload.
import {createRequire} from 'node:module'
import {writeFile, mkdir} from 'node:fs/promises'
const {chromium}=createRequire(import.meta.url)('@playwright/test')
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 const page=await browser.newPage()
 const bytes=await page.evaluate(async()=>{
  const canvas=document.createElement('canvas');canvas.width=640;canvas.height=360
  document.body.appendChild(canvas)
  const ctx=canvas.getContext('2d');ctx.fillStyle='#242019';ctx.fillRect(0,0,640,360)
  const stream=canvas.captureStream(0),track=stream.getVideoTracks()[0],chunks=[]
  const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp8'})
  recorder.ondataavailable=event=>chunks.push(event.data)
  const done=new Promise(resolve=>recorder.onstop=async()=>resolve([...new Uint8Array(await new Blob(chunks).arrayBuffer())]))
  recorder.start()
  for(let frame=0;frame<24;frame++){
    ctx.fillStyle=frame%2?'#242019':'#948158';ctx.fillRect(0,0,640,360);ctx.fillStyle='white';ctx.font='28px sans-serif';ctx.fillText('Vidéo de recette locale',150,180)
    track.requestFrame();await new Promise(resolve=>setTimeout(resolve,100))
  }
  recorder.stop();const bytes=await done;stream.getTracks().forEach(track=>track.stop());return bytes
 })
 await mkdir('.tmp/qa',{recursive:true});await writeFile('.tmp/qa/test-video.webm',new Uint8Array(bytes))
 console.log('Created .tmp/qa/test-video.webm')
} finally {await browser.close()}
