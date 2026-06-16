"use client"

import type React from "react"
import { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { CheckCircle2, Loader2, Lock } from "lucide-react"

export const dynamic = "force-dynamic"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams])

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError("This reset link is missing a token. Please request a new password reset email.")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      await api.resetPassword(token, newPassword)
      setSuccess(true)
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => router.push("/"), 2500)
    } catch (err) {
      setError("Unable to reset your password. The link may be expired or already used.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-12 pt-28 text-white">
      <Card className="mx-auto max-w-lg border-gray-800 bg-gray-900 text-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
            {success ? <CheckCircle2 className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
          </div>
          <CardTitle className="font-playfair text-2xl text-gold">
            {success ? "Password updated" : "Reset password"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-5 text-center">
              <p className="text-gray-300">Your password has been changed. You can sign in with your new password.</p>
              <Button asChild className="bg-gold text-black hover:bg-gold/90">
                <Link href="/">Back to store</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!token && (
                <Alert className="border-red-600 bg-red-900/20">
                  <AlertDescription className="text-red-400">
                    Reset token is missing. Please use the link from your email.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                  minLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <Alert className="border-red-600 bg-red-900/20">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !token}
                className="w-full bg-gold font-semibold text-black hover:bg-gold/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-black pt-20 text-white">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
