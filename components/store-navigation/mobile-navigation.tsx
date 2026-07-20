"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import NavigationItemLink from "./navigation-item-link"
import type { NavigationItem } from "./navigation-types"

function MobileNavigationBranch({ item, onNavigate, level = 0 }: { item: NavigationItem; onNavigate: () => void; level?: number }) {
  const [open, setOpen] = useState(false)
  const children = item.children ?? []

  if (children.length === 0) {
    return (
      <NavigationItemLink
        item={item}
        onNavigate={onNavigate}
        className="group flex min-h-12 items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white/90 transition-colors hover:border-gold/35 hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <span>{item.label}</span>
        <ChevronRight className="h-4 w-4 text-gold/60 transition-transform group-hover:translate-x-1" />
      </NavigationItemLink>
    )
  }

  return (
    <div className={level > 0 ? "ml-3 border-l border-white/10 pl-3" : undefined}>
      <button
        type="button"
        className="flex min-h-12 w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left text-sm font-medium text-white/90 transition-colors hover:border-gold/35 hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex items-center">
          {item.label}
          {item.badge && (
            <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-black">
              {item.badge}
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-gold/70 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {children.map((child) => (
            <MobileNavigationBranch key={child.id} item={child} onNavigate={onNavigate} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MobileNavigation({ items, onNavigate }: { items: NavigationItem[]; onNavigate: () => void }) {
  return (
    <nav aria-label="Mobile navigation" className="flex flex-col gap-3">
      {items.map((item) => (
        <MobileNavigationBranch key={item.id} item={item} onNavigate={onNavigate} />
      ))}
    </nav>
  )
}
