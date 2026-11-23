"use client"
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { studioStyles, validStudioContent, type StudioContent, type StudioDocument, type StudioManifest } from "@/lib/studio-contract"
import { contentDigest, mediaIdentity, samePreview, validPreviewContext } from "@/lib/studio-preview-protocol"
import { studioOrigin } from "@/lib/preview-access"

type MediaState = { url: string; state: "loading" | "ready" | "error"; current_src?: string }
const StudioContext = createContext<{ content: StudioContent | null; hidden: string[]; preview: boolean; manifest: StudioManifest | null; reportMedia: (state: MediaState) => void }>({content: null, hidden: [], preview: false, manifest: null, reportMedia: () => {}})
export const useStudio = () => useContext(StudioContext)

export function StudioRuntime({ document, children }: { document: StudioDocument | null; children: ReactNode }) {
  const [live, setLive] = useState({ content: document?.studio || null, update: 0 })
  const [hydrated, setHydrated] = useState(false)
  const newest = useRef(0)
  useEffect(() => { setHydrated(true); newest.current = 0; setLive({content: document?.studio || null, update: 0}) }, [document])
  const context = document?.preview_context
  useEffect(() => {
    const origin = studioOrigin()
    if (!document?.preview || !origin || window.parent === window) return
    if (!validPreviewContext(context)) {
      window.parent.postMessage({type: "yovo:store-preview-error", code: "PREVIEW_CONTRACT_INVALID", status: 502, stage: "exchange"}, origin)
      return
    }
    const ready = () => window.parent.postMessage({type: "yovo:store-ready", context}, origin)
    const receive = (event: MessageEvent) => {
      if (event.origin !== origin || event.source !== window.parent || !samePreview(context, event.data?.context)) return
      if (event.data.type === "yovo:studio-hello") { ready(); return }
      if (event.data.type !== "yovo:studio-content" || !Number.isSafeInteger(event.data.update_id) || event.data.update_id < newest.current || event.data.update_id < 1) return
      if (validStudioContent(event.data.content, document.manifest.template_id)) {
        newest.current = event.data.update_id
        setLive({content: event.data.content, update: event.data.update_id})
      }
    }
    window.addEventListener("message", receive)
    ready()
    return () => window.removeEventListener("message", receive)
  }, [document, context])
  useEffect(() => {
    const origin = studioOrigin()
    if (!document?.preview || !validPreviewContext(context) || !origin || !live.content || !live.update || window.parent === window) return
    let active = true
    // Confirm only after React committed the complete content, not on receipt.
    void contentDigest(live.content).then(digest => {
      if (active) window.parent.postMessage({type: "yovo:store-content-applied", context, update_id: live.update, digest, media: mediaIdentity(live.content!)}, origin)
    }).catch(() => { if (active) window.parent.postMessage({type: "yovo:store-preview-error", code: "PREVIEW_CONTRACT_INVALID", status: 502, stage: "exchange"}, origin) })
    return () => { active = false }
  }, [live, document, context])
  const reportMedia = useCallback((state: MediaState) => {
    const origin = studioOrigin()
    if (document?.preview && validPreviewContext(context) && origin && window.parent !== window && (state.url === live.content?.hero.media?.url || state.url === (live.content?.hero.poster?.url || live.content?.hero.media?.thumbnail_url))) {
      window.parent.postMessage({type: "yovo:store-media-state", context, update_id: live.update, ...state}, origin)
    }
  }, [document, context, live])
  const content = live.content
  const hidden = document?.manifest.pages.filter(p => content?.visibility[p.key] === false).map(p => p.path) || []
  return <StudioContext.Provider value={{content, hidden, preview: !!document?.preview, manifest: document?.manifest || null, reportMedia}}>
    <div data-studio-hydrated={hydrated} data-studio-template={document?.manifest.template_id} data-studio-revision={document?.revision || 0} data-studio-draft={context?.draft_fingerprint} data-studio-update={live.update} data-grid-catalog={content?.grids.catalog || "default"} data-grid-categories={content?.grids.categories || "default"} style={studioStyles(content)}>
      {document?.preview && <div className="fixed bottom-3 left-3 z-[100] rounded-lg bg-slate-950 px-4 py-3 text-sm text-white" role="status">Aperçu privé · Achats désactivés <a className="ml-3 underline" href="/api/preview/exit">Quitter</a></div>}
      {children}
    </div>
  </StudioContext.Provider>
}
