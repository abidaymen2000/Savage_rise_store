"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { studioStyles, validStudioContent, type StudioContent, type StudioDocument } from "@/lib/studio-contract"
import { studioOrigin } from "@/lib/preview-access"

const StudioContext = createContext<{ content: StudioContent | null; hidden: string[]; preview: boolean }>({content: null, hidden: [], preview: false})
export const useStudio = () => useContext(StudioContext)

export function StudioRuntime({ document, children }: { document: StudioDocument | null; children: ReactNode }) {
  const [content, setContent] = useState(document?.studio || null)
  useEffect(() => setContent(document?.studio || null), [document])
  useEffect(() => {
    const origin = studioOrigin()
    if (!document?.preview || !origin || window.parent === window) return
    const receive = (event: MessageEvent) => {
      if (event.origin !== origin || event.source !== window.parent || event.data?.type !== "yovo:studio-content") return
      if (validStudioContent(event.data.content, document.manifest.template_id)) setContent(event.data.content)
    }
    window.addEventListener("message", receive)
    window.parent.postMessage({type: "yovo:store-ready"}, origin)
    return () => window.removeEventListener("message", receive)
  }, [document])
  const hidden = document?.manifest.pages.filter(p => content?.visibility[p.key] === false).map(p => p.path) || []
  return <StudioContext.Provider value={{content, hidden, preview: !!document?.preview}}>
    <div data-studio-template="savage-rise" data-studio-revision={document?.revision || 0} data-grid-catalog={content?.grids.catalog || "default"} data-grid-categories={content?.grids.categories || "default"} style={studioStyles(content)}>
      {document?.preview && <div className="fixed bottom-3 left-3 z-[100] rounded-lg bg-slate-950 px-4 py-3 text-sm text-white" role="status">Aperçu privé · Achats désactivés <a className="ml-3 underline" href="/api/preview/exit">Quitter</a></div>}
      {children}
    </div>
  </StudioContext.Provider>
}
