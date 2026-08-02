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
      setError("Invalid or expired verification code")
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
      setError("Error sending the code")
    } finally {
      setIsResending(false)
    }
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-background text-foreground border-border max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Email verified!</h2>
            <p className="text-muted-foreground">Your account is now active.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background text-foreground border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-center text-accent">Email verification</DialogTitle>
        </DialogHeader>

        <div className="text-center mb-6">
          <Mail className="h-12 w-12 text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">
            A verification code has been sent to <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <Alert className="border-red-600 bg-red-900/20 mb-4">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <Label htmlFor="verification-code">Verification code</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="Enter the code received by email"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="bg-card border-input text-card-foreground text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || verificationCode.length < 6}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted-foreground text-sm mb-2">Did not receive the code?</p>
          <Button
            variant="ghost"
            onClick={handleResendCode}
            disabled={isResending}
            className="text-accent hover:text-accent/80"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend code"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

