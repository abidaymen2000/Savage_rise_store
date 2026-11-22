export type StudioMedia = { asset_id?: string | null; url: string; mime?: string | null; alt?: string; thumbnail_url?: string | null; width?: number | null; height?: number | null; size?: number | null; duration?: number | null }
export type StudioHero = { eyebrow?: string | null; title?: string | null; subtitle?: string | null; primary_label?: string | null; secondary_label?: string | null; media?: StudioMedia | null; poster?: StudioMedia | null }
export type StudioContent = { template_id: string; contract_version: number; hero: StudioHero; visibility: Record<string, boolean>; typography: Record<string, string>; grids: Record<string, string> }
export type StudioManifest = { template_id: string; contract_version: number; pages: { key: string; label: string; path: string; required: boolean; hideable: boolean; legacy: boolean; sections: { key: string; label: string; fields: string[]; media_types?: string[]; poster_types?: string[]; grid?: boolean }[] }[]; fonts: {id: string; label: string; languages: string[]}[]; font_roles: string[]; grid_sizes: {id: string; label: string}[]; grid_sections: string[]; preview: {enabled: boolean; path: string}; publication: {atomic: boolean; history: boolean; restore_to_draft: boolean} }
export type StudioDocument = { studio: StudioContent; manifest: StudioManifest; hidden_paths: string[]; revision: number; preview: boolean }
export const studioFonts: Record<string, string> = { sans: 'Arial, Tahoma, sans-serif', serif: 'Georgia, Tahoma, serif', tahoma: 'Tahoma, Arial, sans-serif' }
export function studioStyles(content?: StudioContent | null): Record<string, string> {
  return Object.fromEntries(Object.entries(content?.typography || {}).filter(([role,font]) => ['heading','subheading','description','body','button'].includes(role) && studioFonts[font]).map(([role,font])=>['--studio-font-'+role,studioFonts[font]]))
}
export function hiddenPath(path: string, hidden: string[] = []): boolean {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  return hidden.some(route => clean === route || clean.startsWith(route + '/'))
}
export function validStudioContent(value: unknown, template: string): value is StudioContent {
  if (!value || typeof value !== 'object') return false
  const content = value as StudioContent
  return content.template_id === template && content.contract_version === 3 && !!content.hero && !!content.visibility && !!content.typography && !!content.grids
}
