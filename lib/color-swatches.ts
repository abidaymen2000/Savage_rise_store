export function getColorSwatch(value: string | null | undefined): string {
  const key = (value ?? "").toLowerCase().trim()
  const map: Record<string, string> = {
    black: "#111111",
    white: "#ffffff",
    grey: "#808080",
    gray: "#808080",
    red: "#dc2626",
    blue: "#2563eb",
    green: "#16a34a",
    beige: "#d6c2a1",
    cream: "#f5f0dc",
    navy: "#172554",
  }
  return map[key] ?? key ?? "#111111"
}

