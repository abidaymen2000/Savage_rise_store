"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { StoreConfigResult } from "@/lib/store-config-shared"
import { FALLBACK_STORE_CONFIG } from "@/lib/store-config-shared"

const StoreConfigContext = createContext<StoreConfigResult>({
  config: FALLBACK_STORE_CONFIG,
  unavailable: true,
})

export function StoreConfigProvider({
  value,
  children,
}: {
  value: StoreConfigResult
  children: ReactNode
}) {
  return <StoreConfigContext.Provider value={value}>{children}</StoreConfigContext.Provider>
}

export function useStoreConfig() {
  return useContext(StoreConfigContext)
}
