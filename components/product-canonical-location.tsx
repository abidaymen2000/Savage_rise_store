"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

// Studio stores an immutable product ID, while the product owns its mutable slug.
// Replace only the loaded ID alias. Native history integrates with Next's router
// without another product request or an extra entry in the browser's Back stack.
export function ProductCanonicalLocation({ id, slug }: { id: string; slug?: string }) {
  const pathname = usePathname()
  useEffect(() => {
    if (!slug || slug === id || pathname !== `/products/${encodeURIComponent(id)}`) return
    window.history.replaceState(null, "", `/products/${encodeURIComponent(slug)}${window.location.search}${window.location.hash}`)
  }, [id, slug, pathname])
  return null
}
