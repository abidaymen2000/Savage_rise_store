"use client"

import { useEffect, useState } from "react"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "./AuthModal"
import { trackStoreEvent } from "@/lib/store-analytics"
import type { DropCountdown, DropNotificationStatus } from "@/types/api"

export default function HeroDropNotification({ drop }: { drop: DropCountdown }) {
  const { isAuthenticated } = useAuth()
  const [notificationStatus, setNotificationStatus] = useState<DropNotificationStatus | null>(null)
  const [isNotificationLoading, setIsNotificationLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !drop.email_enabled) {
      setNotificationStatus(null)
      return
    }
    api.getDropNotificationStatus().then(setNotificationStatus).catch(() => setNotificationStatus(null))
  }, [drop.email_enabled, isAuthenticated])

  const toggleDropNotification = async () => {
    if (!drop.email_enabled) return
    trackStoreEvent("notify_me_clicked", {
      metadata: {
        drop_name: drop.drop_name,
        drop_title: drop.title,
        already_subscribed: notificationStatus?.is_subscribed ?? false,
      },
    })
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    setIsNotificationLoading(true)
    try {
      const next = notificationStatus?.is_subscribed ? await api.unsubscribeDropNotification() : await api.subscribeDropNotification()
      setNotificationStatus(next)
    } finally {
      setIsNotificationLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={isNotificationLoading}
        onClick={toggleDropNotification}
        className="h-12 rounded-none border-white/70 bg-transparent px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-black"
      >
        {notificationStatus?.is_subscribed ? <Check className="mr-2 h-4 w-4" /> : <Bell className="mr-2 h-4 w-4" />}
        {notificationStatus?.is_subscribed ? "Inscrit" : "Me prevenir"}
      </Button>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
