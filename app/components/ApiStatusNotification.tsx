"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, WifiOff } from "lucide-react"
import { api } from "@/lib/api"

export default function ApiStatusNotification() {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking")
  const [showNotification, setShowNotification] = useState(false)
  const [hasShownOfflineNotice, setHasShownOfflineNotice] = useState(false)

  useEffect(() => {
    async function checkApiStatus() {
      try {
        const health = await api.checkHealth()
        const newStatus = health.status as "online" | "offline"

        if (newStatus !== apiStatus) {
          setApiStatus(newStatus)

          // Show notification when going offline (but only once per session)
          if (newStatus === "offline" && !hasShownOfflineNotice) {
            setShowNotification(true)
            setHasShownOfflineNotice(true)
          }
        }
      } catch (error) {
        if (apiStatus !== "offline") {
          setApiStatus("offline")
          if (!hasShownOfflineNotice) {
            setShowNotification(true)
            setHasShownOfflineNotice(true)
          }
        }
      }
    }

    checkApiStatus()
  }, [apiStatus, hasShownOfflineNotice])

  if (!showNotification || apiStatus === "online") {
    return null
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <Alert className="border-yellow-600 bg-yellow-900/20 text-yellow-100">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="pr-8">
          <div className="font-semibold mb-1">Mode Démonstration</div>
          <div className="text-sm">L'API n'est pas disponible. Vous naviguez avec des données de démonstration.</div>
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-yellow-100 hover:text-yellow-200"
          onClick={() => setShowNotification(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  )
}
