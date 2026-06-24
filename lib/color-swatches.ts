export function getColorSwatch(color: string) {
  const normalized = color.toLowerCase().trim()

  if (normalized.includes("greige")) return "#b7aa98"
  if (normalized.includes("taupe")) return "#8f7f6b"
  if (normalized.includes("stone")) return "#b9ad96"
  if (normalized.includes("sand")) return "#c9b38f"
  if (normalized.includes("beige") || normalized.includes("cream")) return "#d8c7a1"
  if (normalized.includes("noir") || normalized.includes("black")) return "#050505"
  if (normalized.includes("blanc") || normalized.includes("white")) return "#f5f1e8"
  if (normalized.includes("gris") || normalized.includes("gray") || normalized.includes("grey")) return "#777777"
  if (normalized.includes("bleu") || normalized.includes("blue")) return "#1f3f74"
  if (normalized.includes("rouge") || normalized.includes("red")) return "#8f1d1d"
  if (normalized.includes("vert") || normalized.includes("green")) return "#245c3b"

  return "#a3a3a3"
}
