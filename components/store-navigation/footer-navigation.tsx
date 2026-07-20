"use client"

import NavigationItemLink from "./navigation-item-link"
import type { NavigationItem } from "./navigation-types"

function FooterColumn({ item }: { item: NavigationItem }) {
  const children = item.children ?? []
  if (children.length === 0) {
    return (
      <li>
        <NavigationItemLink item={item} className="text-sm text-gray-400 transition-colors hover:text-white" />
      </li>
    )
  }

  return (
    <li>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-white">{item.label}</p>
      <ul className="space-y-2">
        {children.map((child) => (
          <FooterColumn key={child.id} item={child} />
        ))}
      </ul>
    </li>
  )
}

export default function FooterNavigation({ items }: { items: NavigationItem[] }) {
  if (items.length === 0) return null

  const hasColumns = items.some((item) => (item.children?.length ?? 0) > 0)

  if (!hasColumns) {
    return (
      <div>
        <h4 className="mb-4 font-semibold text-white">NAVIGATION</h4>
        <ul className="space-y-2">
          {items.map((item) => (
            <FooterColumn key={item.id} item={item} />
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.id}>
          {(item.children?.length ?? 0) > 0 ? (
            <>
              <h4 className="mb-4 font-semibold uppercase tracking-[0.14em] text-white">{item.label}</h4>
              <ul className="space-y-2">
                {item.children?.map((child) => (
                  <FooterColumn key={child.id} item={child} />
                ))}
              </ul>
            </>
          ) : (
            <ul>
              <FooterColumn item={item} />
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
