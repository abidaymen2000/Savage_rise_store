"use client"

import { ChevronRight } from "lucide-react"
import NavigationItemLink from "./navigation-item-link"
import type { NavigationItem } from "./navigation-types"

type NavigationDropdownProps = {
  item: NavigationItem
  onNavigate?: () => void
  level?: number
}

export default function NavigationDropdown({ item, onNavigate, level = 0 }: NavigationDropdownProps) {
  const children = item.children ?? []
  if (children.length === 0) {
    return (
      <NavigationItemLink
        item={item}
        onNavigate={onNavigate}
        className="flex items-center justify-between gap-4 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-white/80 dark:hover:bg-white/5 dark:hover:text-gold"
      />
    )
  }

  return (
    <div className={level === 0 ? "space-y-1" : "ml-3 mt-1 border-l border-border pl-3 dark:border-white/10"}>
      <NavigationItemLink
        item={item}
        onNavigate={onNavigate}
        className="flex items-center justify-between gap-4 rounded-md px-3 py-2 text-sm font-semibold text-popover-foreground transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-white dark:hover:bg-white/5 dark:hover:text-gold"
      >
        <span className="flex items-center">
          {item.label}
          {item.badge && (
            <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
              {item.badge}
            </span>
          )}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-gold/70" aria-hidden="true" />
      </NavigationItemLink>
      <div className="space-y-1">
        {children.map((child) => (
          <NavigationDropdown key={child.id} item={child} onNavigate={onNavigate} level={level + 1} />
        ))}
      </div>
    </div>
  )
}
