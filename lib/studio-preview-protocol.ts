// Shared Studio preview contract. Keep identical in CMS and both declared renderers.
import type { StudioContent } from './studio-contract'
export type PreviewContext = { version: 1; session_id: string; store_id: string; template_id: string; draft_fingerprint: string; published_revision: number }
export function validPreviewContext(value: unknown): value is PreviewContext {
  const c = value as PreviewContext | null
  return !!c && c.version === 1 && /^[a-f0-9]{32}$/.test(c.session_id) && /^s_[a-f0-9]{16}$/.test(c.store_id) && ['savage-rise','yovoflow-standard'].includes(c.template_id) && /^[a-f0-9]{64}$/.test(c.draft_fingerprint) && Number.isSafeInteger(c.published_revision) && c.published_revision >= 0
}
export function samePreview(a: PreviewContext, b: unknown): b is PreviewContext {
  return validPreviewContext(b) && a.session_id === b.session_id && a.store_id === b.store_id && a.template_id === b.template_id && a.draft_fingerprint === b.draft_fingerprint && a.published_revision === b.published_revision
}
export function mediaIdentity(content: StudioContent) {
  return { asset_id: content.hero.media?.asset_id || null, url: content.hero.media?.url || null, poster_url: content.hero.poster?.url || content.hero.media?.thumbnail_url || null }
}
function ordered(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(ordered)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).sort(([a],[b])=>a < b ? -1 : a > b ? 1 : 0).map(([k,v])=>[k,ordered(v)]))
  return value
}
export async function contentDigest(content: StudioContent): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(ordered(content)))
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b=>b.toString(16).padStart(2,'0')).join('')
}
