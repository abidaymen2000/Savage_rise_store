import type { ProductStorefrontDetail, ProductVariantRead } from "@/lib/api/generated"

const key = (value: string) => value.normalize("NFKC").trim().toLowerCase().replace(/[\s_-]+/g, "_")
const colorNames = new Set(["color", "colour", "couleur"])
const sizeNames = new Set(["size", "taille"])
const safeLabel = (value: string | undefined) => {
  const text = value?.trim() || ""
  return /^[a-f0-9]{24}$/i.test(text) || /^[a-f0-9]{8}-[a-f0-9-]{27,}$/i.test(text)
    ? "Valeur indisponible" : text.replace(/[_]+/g, " ")
}

/** IDs/codes select options; their canonical labels are the only display source. */
export function catalogOptionDisplay(variant: ProductVariantRead, axes: ProductStorefrontDetail["option_axes"] = []) {
  const values = variant.option_values ?? {}
  const labels: Record<string, string> = {}
  let color: { label: string; value: string; swatch?: string | null } | undefined
  let size: string | undefined
  for (const [axisKey, value] of Object.entries(values)) {
    const axis = axes?.find(a => a.attribute_id === axisKey || key(a.code) === key(axisKey))
    const matches = axis?.values?.filter(o => o.id === value || key(o.code) === key(value)) ?? []
    const option = matches.length === 1 ? matches[0] : undefined
    const label = safeLabel(option?.label || variant.option_value_labels?.[axisKey] || value)
    labels[axisKey] = label
    const role = key(axis?.system_key || axis?.code || axisKey)
    if (colorNames.has(role)) color = { label, value: option?.code || value, swatch: option?.swatch }
    if (sizeNames.has(role)) size = label
  }
  return { labels, color, size }
}
