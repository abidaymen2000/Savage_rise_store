"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { resolveNavigationHref } from "@/lib/store-navigation/resolve-navigation-href"
import type { NavigationItem } from "./navigation-types"

type NavigationItemLinkProps = {
  item: NavigationItem
  className?: string
  children?: React.ReactNode
  onNavigate?: () => void
}

export default function NavigationItemLink({ item, className, children, onNavigate }: NavigationItemLinkProps) {
  const resolved = resolveNavigationHref(item.destination, item.open_in_new_tab)
  if (!resolved) return null

  const content = (
    <>
      {children ?? item.label}
      {item.badge && (
        <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-black">
          {item.badge}
        </span>
      )}
      {resolved.isExternal && <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />}
    </>
  )

  if (resolved.isExternal) {
    return (
      <a href={resolved.href} target={resolved.target} rel={resolved.rel} className={className} onClick={onNavigate}>
        {content}
      </a>
    )
  }

  return (
    <Link href={resolved.href} target={resolved.target} rel={resolved.rel} className={className} onClick={onNavigate}>
      {content}
    </Link>
  )
}
