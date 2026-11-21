"use client"
import { useStoreConfig } from "@/contexts/StoreConfigContext"
import { formatStorePrice } from "@/lib/store-config-shared"

export function useStorePrice() {
  const { config } = useStoreConfig()
  return (amount: number) => formatStorePrice(amount, config)
}
