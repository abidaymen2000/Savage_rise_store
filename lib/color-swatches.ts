function normalizeColorName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function isCssColor(value: string): boolean {
  return (
    /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value) ||
    /^rgba?\([\d\s.,%+-]+\)$/i.test(value) ||
    /^hsla?\([\d\s.,%+-]+(?:deg|rad|turn)?[\d\s.,%+-]*\)$/i.test(value)
  )
}

function fallbackColorFromName(name: string): string {
  let hash = 0
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) % 360
  }
  return `hsl(${hash} 58% 62%)`
}

export function getColorSwatch(value: string | null | undefined): string {
  const raw = (value ?? "").trim()
  if (!raw) return "#111111"
  if (isCssColor(raw)) return raw

  const key = normalizeColorName(raw)
  const map: Record<string, string> = {
    black: "#111111",
    noir: "#111111",
    white: "#ffffff",
    blanc: "#ffffff",
    grey: "#808080",
    gray: "#808080",
    gris: "#808080",
    grige: "#b8ad9a",
    greige: "#b8ad9a",
    "beige gris": "#b8ad9a",
    red: "#dc2626",
    rouge: "#dc2626",
    burgundy: "#7f1d1d",
    bordeaux: "#7f1d1d",
    blue: "#2563eb",
    bleu: "#2563eb",
    "bleu ciel": "#87ceeb",
    "sky blue": "#87ceeb",
    skyblue: "#87ceeb",
    "light blue": "#93c5fd",
    "bleu clair": "#93c5fd",
    green: "#16a34a",
    vert: "#16a34a",
    beige: "#d6c2a1",
    cream: "#f5f0dc",
    creme: "#f5f0dc",
    navy: "#172554",
    marine: "#172554",
    "bleu marine": "#172554",
    brown: "#7c2d12",
    marron: "#7c2d12",
    orange: "#f97316",
    yellow: "#facc15",
    jaune: "#facc15",
    pink: "#f9a8d4",
    rose: "#f9a8d4",
    purple: "#9333ea",
    violet: "#9333ea",
  }

  return map[key] ?? fallbackColorFromName(key)
}
