"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "signup"
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false) // 👈 pour le bouton de renvoi
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // 👇 Assure-toi que resendVerification est bien exposé par le context
  const { login, signup, resendVerification } = useAuth()

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
          setError("Votre compte n’est pas encore vérifié. Nous venons de renvoyer l’email de vérification. Vérifiez votre boîte de réception et vos spams.")
        } catch {
          setError("Votre compte n’est pas encore vérifié. Cliquez sur “Renvoyer l’email de vérification”.")
        }
      } else if (status === 401 && detail === "INVALID_CREDENTIALS") {
        setError("Email ou mot de passe incorrect")
      } else {
        setError("Une erreur est survenue. Réessayez.")
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
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    if (signupForm.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      setIsLoading(false)
      return
    }

    try {
      await signup(signupForm.email, signupForm.password, signupForm.fullName)
      setSuccess("Compte créé avec succès ! Vérifiez votre email pour activer votre compte.")
      // 🔒 On garde l'email (et même le nom si tu veux), on vide juste les mdp
      setSignupForm(prev => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }))
      // (optionnel) rester sur l’onglet signup
      // setActiveTab("signup")
    } catch (err) {
      setError("Erreur lors de la création du compte. Cet email est peut-être déjà utilisé.")
    } finally {
      setIsLoading(false)
    }
  }

  // 👇 Renvoi email de vérification
  const handleResend = async () => {
    setError(null)
    setSuccess(null)

    const email = (signupForm.email || loginForm.email).trim()
    if (!email) {
      setError("Veuillez saisir votre email avant de renvoyer la vérification.")
      return
    }

    try {
      setIsResending(true)
      await resendVerification(email)
      setSuccess("Email de vérification renvoyé ! Vérifiez votre boîte de réception et vos spams.")
    } catch {
      setError("Impossible de renvoyer l'email pour le moment. Réessayez plus tard.")
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
            Bienvenue chez Savage Rise
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="login" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Connexion
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Inscription
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
                    placeholder="votre@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showLoginPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
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
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
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
                    placeholder="votre@email.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-fullname">Nom complet</Label>
                <Input
                  id="signup-fullname"
                  type="text"
                  placeholder="Votre nom complet"
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signup-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
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
                    Création...
                  </>
                ) : (
                  "Créer mon compte"
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
                    Envoi...
                  </>
                ) : (
                  "Renvoyer l’email de vérification"
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                Saisissez votre email ci‑dessus puis cliquez si vous n’avez pas reçu le mail.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-400">
          En vous inscrivant, vous acceptez nos{" "}
          <a href="/terms" className="text-gold hover:underline">
            conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="/privacy" className="text-gold hover:underline">
            politique de confidentialité
          </a>
          .
        </div>
      </DialogContent>
    </Dialog>
  )
}
