"use client"

import { useEffect } from "react"
import { trackStoreEvent } from "@/lib/store-analytics"

export default function CollectionViewTracker({ collection, metadata = {} }: { collection: string; metadata?: Record<string, unknown> }) {
  useEffect(() => {
    trackStoreEvent("collection_viewed", {
      metadata: {
        collection,
        ...metadata,
      },
    })
  }, [collection, metadata])

  return null
}
