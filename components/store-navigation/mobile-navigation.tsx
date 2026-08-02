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
        className="group flex min-h-12 items-center justify-between rounded-lg border border-border bg-card px-4 py-3.5 text-sm font-medium text-card-foreground transition-colors hover:border-accent/35 hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-white/10 dark:bg-white/[0.03] dark:text-white/90 dark:hover:border-gold/35 dark:hover:bg-gold/10 dark:hover:text-gold"
      >
        <span>{item.label}</span>
        <ChevronRight className="h-4 w-4 text-gold/60 transition-transform group-hover:translate-x-1" />
      </NavigationItemLink>
    )
  }

  return (
    <div className={level > 0 ? "ml-3 border-l border-border pl-3 dark:border-white/10" : undefined}>
      <button
        type="button"
        className="flex min-h-12 w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3.5 text-left text-sm font-medium text-card-foreground transition-colors hover:border-accent/35 hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-white/10 dark:bg-white/[0.03] dark:text-white/90 dark:hover:border-gold/35 dark:hover:bg-gold/10 dark:hover:text-gold"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex items-center">
          {item.label}
          {item.badge && (
            <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
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
