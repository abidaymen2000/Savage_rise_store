import { NextRequest, NextResponse } from "next/server"
import { previewFrameAncestors, studioOrigin } from "@/lib/preview-access"

// Route handlers bypass the Store layout, allowing preview of a closed shop.
export function GET(request: NextRequest) {
  const nonce = crypto.randomUUID()
  const base = ""
  const endpoint = JSON.stringify(base + "/api/preview")
  const studio = studioOrigin()
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>Aperçu de la boutique</title><style nonce="${nonce}">body{margin:0;padding:32px 20px;background:#f8faf9;color:#17251f;font:16px/1.6 system-ui,sans-serif}main{max-width:560px;margin:10vh auto;background:white;padding:28px;border:1px solid #dce5df;border-radius:16px}h1{font-size:24px;line-height:1.3}a{display:inline-block;color:#175a3b;padding:12px 0}a:focus-visible{outline:3px solid #175a3b;outline-offset:4px}</style></head><body><main><h1>Ouverture de l’aperçu</h1><p id="state" role="status">Vérification de votre accès temporaire…</p>${studio ? `<a href="${studio}/admin/cms/website-studio" target="_top" rel="noreferrer">Retourner dans Studio</a>` : ""}</main><script nonce="${nonce}">
  (async()=>{
    const fragment=new URLSearchParams(location.hash.slice(1));
    const token=fragment.get('token');
    const path=new URLSearchParams(location.search).get('path') || '/';
    const studio=${JSON.stringify(studio)};
    history.replaceState(null,'',location.pathname);
    function report(code,status){if(studio&&window.parent!==window)window.parent.postMessage({type:'yovo:store-preview-error',code,status,stage:'exchange'},studio);}
    try {
      const response=await fetch(${endpoint},{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,path}),signal:AbortSignal.timeout(25000)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok){report(result.code||'PREVIEW_UNAVAILABLE',response.status);throw new Error(result.error || 'Le service d’aperçu est indisponible.');}
      if(typeof result.location!=='string'||!result.location.startsWith('/')||result.location.startsWith('//'))throw new Error('Adresse d’aperçu invalide.');
      location.replace(result.location);
    }catch(error){const state=document.getElementById('state');state.setAttribute('role','alert');state.textContent=error.name==='TimeoutError'?'Le service d’aperçu met trop de temps à répondre. Réessayez depuis Studio.':error.message;if(error.name==='TimeoutError'||error.name==='TypeError')report('PREVIEW_UNAVAILABLE',503);}
  })();</script></body></html>`
  return new NextResponse(html, { headers: {
    "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store",
    "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow",
    "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self'; base-uri 'none'; ${previewFrameAncestors()}`,
  } })
}
