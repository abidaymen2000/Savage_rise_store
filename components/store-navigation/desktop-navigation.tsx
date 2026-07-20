"use client"

import { useEffect, useId, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import NavigationDropdown from "./navigation-dropdown"
import NavigationItemLink from "./navigation-item-link"
import type { NavigationItem } from "./navigation-types"
import { resolveNavigationHref } from "@/lib/store-navigation/resolve-navigation-href"

function isActiveItem(item: NavigationItem, pathname: string): boolean {
  const resolved = resolveNavigationHref(item.destination, item.open_in_new_tab)
  if (resolved && !resolved.isExternal && (pathname === resolved.href || pathname.startsWith(`${resolved.href}/`))) return true
  return item.children?.some((child) => isActiveItem(child, pathname)) ?? false
}

export default function DesktopNavigation({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname()
  const [openId, setOpenId] = useState<string | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const panelId = useId()

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenId(null)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <nav ref={navRef} aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
      <ul className="flex items-center gap-8">
        {items.map((item) => {
          const children = item.children ?? []
          const active = isActiveItem(item, pathname)
          const triggerClass = `inline-flex items-center gap-1 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            active ? "text-gold" : "text-white hover:text-gold"
          }`

          return (
            <li
              key={item.id}
              className="relative"
              onMouseEnter={() => children.length > 0 && setOpenId(item.id)}
              onMouseLeave={() => children.length > 0 && setOpenId((current) => (current === item.id ? null : current))}
            >
              {children.length > 0 ? (
                <>
                  <button
                    type="button"
                    className={triggerClass}
                    aria-haspopup="menu"
                    aria-expanded={openId === item.id}
                    aria-controls={`${panelId}-${item.id}`}
                    onFocus={() => setOpenId(item.id)}
                    onClick={() => setOpenId((current) => (current === item.id ? null : item.id))}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold uppercase text-black">
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <div
                    id={`${panelId}-${item.id}`}
                    role="menu"
                    className={`absolute left-1/2 top-full mt-4 w-max min-w-56 max-w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-gold/20 bg-black/95 p-2 shadow-2xl shadow-black/60 backdrop-blur transition motion-reduce:transition-none ${
                      openId === item.id ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                    }`}
                  >
                    {children.map((child) => (
                      <NavigationDropdown key={child.id} item={child} onNavigate={() => setOpenId(null)} />
                    ))}
                  </div>
                </>
              ) : (
                <NavigationItemLink item={item} className={triggerClass} onNavigate={() => setOpenId(null)} />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
