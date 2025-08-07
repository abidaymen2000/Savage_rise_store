"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { api } from "@/lib/api"

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export default function EmailVerificationModal({ isOpen, onClose, email }: EmailVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await api.verifyEmail(verificationCode)
      setSuccess(true)
      setTimeout(() => {
        onClose()
        window.location.reload() // Refresh to update user state
      }, 2000)
    } catch (err) {
      setError("Code de vérification invalide ou expiré")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError(null)

    try {
      // Assuming there's a resend endpoint
      await api.resendVerificationEmail(email)
      setError(null)
      // Show success message briefly
    } catch (err) {
      setError("Erreur lors de l'envoi du code")
    } finally {
      setIsResending(false)
    }
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-black text-white border-gray-800 max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Email vérifié !</h2>
            <p className="text-gray-400">Votre compte est maintenant activé.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black text-white border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-center text-gold">Vérification Email</DialogTitle>
        </DialogHeader>

        <div className="text-center mb-6">
          <Mail className="h-12 w-12 text-gold mx-auto mb-4" />
          <p className="text-gray-400">
            Un code de vérification a été envoyé à <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <Alert className="border-red-600 bg-red-900/20 mb-4">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <Label htmlFor="verification-code">Code de vérification</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="Entrez le code reçu par email"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || verificationCode.length < 6}
            className="w-full bg-gold text-black hover:bg-gold/90 font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              "Vérifier"
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm mb-2">Vous n'avez pas reçu le code ?</p>
          <Button
            variant="ghost"
            onClick={handleResendCode}
            disabled={isResending}
            className="text-gold hover:text-gold/80"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              "Renvoyer le code"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
