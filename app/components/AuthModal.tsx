"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { trackMetaPixelEvent } from "@/lib/meta-pixel"
import { trackStoreEvent } from "@/lib/store-analytics"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "signup"
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false) // 👈 pour le bouton de renvoi
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" })

  // 👇 Assure-toi que resendVerification est bien exposé par le context
  const { login, signup, forgotPassword, resendVerification } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await login(loginForm.email, loginForm.password)
      onClose()
    } catch (err: any) {
      const status = err?.status
      const detail = typeof err?.message === "string" ? err.message : ""

      if (status === 401 && detail === "EMAIL_NOT_VERIFIED") {
        // renvoi auto (optionnel)
        try {
          if (loginForm.email.trim()) await resendVerification(loginForm.email.trim())
          setError("Your account is not verified yet. We just resent the verification email. Please check your inbox and spam folder.")
        } catch {
          setError("Your account is not verified yet. Click “Resend verification email”.")
        }
      } else if (status === 401 && detail === "INVALID_CREDENTIALS") {
        setError("Incorrect email or password")
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (signupForm.password.length < 6) {
      setError("Password must contain at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      await signup(signupForm.email, signupForm.password, signupForm.fullName)
      trackMetaPixelEvent("CompleteRegistration", {
        content_name: "Store account",
        status: true,
      })
      trackStoreEvent("account_created", {
        metadata: {
          method: "email",
        },
      })
      setSuccess("Account created successfully. Check your email to activate your account.")
      // 🔒 On garde l'email (et même le nom si tu veux), on vide juste les mdp
      setSignupForm(prev => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }))
      // (optionnel) rester sur l’onglet signup
      // setActiveTab("signup")
    } catch (err) {
      setError("Account creation failed. This email may already be in use.")
    } finally {
      setIsLoading(false)
    }
  }

  // 👇 Renvoi email de vérification
  const handleForgotPassword = async () => {
    setError(null)
    setSuccess(null)

    const email = loginForm.email.trim()
    if (!email) {
      setError("Please enter your email first, then click forgot password.")
      return
    }

    try {
      setIsSendingReset(true)
      await forgotPassword(email)
      trackStoreEvent("button_clicked", {
        metadata: {
          action: "forgot_password_requested",
        },
      })
      setSuccess("Password reset email sent. Please check your inbox and spam folder.")
      setLoginForm((prev) => ({ ...prev, password: "" }))
    } catch {
      setError("Unable to send the password reset email right now. Please try again later.")
    } finally {
      setIsSendingReset(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setSuccess(null)

    const email = (signupForm.email || loginForm.email).trim()
    if (!email) {
      setError("Please enter your email before resending verification.")
      return
    }

    try {
      setIsResending(true)
      await resendVerification(email)
      trackStoreEvent("button_clicked", {
        metadata: {
          action: "verification_email_resent",
        },
      })
      setSuccess("Verification email resent. Please check your inbox and spam folder.")
    } catch {
      setError("Unable to resend the email right now. Please try again later.")
    } finally {
      setIsResending(false)
    }
  }

  const resetForms = () => {
    setLoginForm({ email: "", password: "" })
    setSignupForm({ fullName: "", email: "", password: "", confirmPassword: "" })
    setError(null)
    setSuccess(null)
  }

  const handleClose = () => {
    resetForms()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black text-white border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-center text-gold">
            Welcome to Savage Rise
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="login" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Sign up
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert className="border-red-600 bg-red-900/20">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-600 bg-green-900/20">
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          {/* --- LOGIN --- */}
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 placeholder:opacity-70"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="login-password">Password</Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isSendingReset}
                    className="text-sm font-medium text-gold hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSendingReset ? "Sending..." : "Forgot password?"}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <PasswordInput
                    id="login-password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 placeholder:opacity-70"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold text-black hover:bg-gold/90 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </TabsContent>

          {/* --- SIGNUP --- */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 placeholder:opacity-70"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-fullname">Full name</Label>
                <Input
                  id="signup-fullname"
                  type="text"
                  placeholder="Your full name"
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 placeholder:opacity-70"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <PasswordInput
                    id="signup-password"
                    placeholder="Create a password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 placeholder:opacity-70"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <PasswordInput
                    id="signup-confirm"
                    placeholder="Confirm your password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 placeholder:opacity-70"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold text-black hover:bg-gold/90 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create my account"
                )}
              </Button>
            </form>

            {/* 👇 Bouton renvoyer l'email de vérification */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={isResending || !signupForm.email.trim()}
                className="w-full border-gold text-gold hover:bg-gold hover:text-black font-semibold"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend verification email"
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                Enter your email above, then click if you did not receive the email.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-400">
          By signing up, you agree to our{" "}
          <a href="/terms" className="text-gold hover:underline">
            terms of use
          </a>{" "}
          and our{" "}
          <a href="/privacy" className="text-gold hover:underline">
            privacy policy
          </a>
          .
        </div>
      </DialogContent>
    </Dialog>
  )
}
