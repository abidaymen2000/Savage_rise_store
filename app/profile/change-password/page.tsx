'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { PasswordChange } from '@/types/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour changer votre mot de passe.',
        variant: 'destructive',
      })
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      const passwordData: PasswordChange = {
        current_password: currentPassword,
        new_password: newPassword,
      }
      await api.changePassword(passwordData.current_password, passwordData.new_password)
      toast({
        title: 'Succès',
        description: 'Votre mot de passe a été mis à jour avec succès.',
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      router.push('/profile')
    } catch (err: any) {
      console.error('Failed to change password:', err)
      setError(err.message || 'Échec du changement de mot de passe.')
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de changer votre mot de passe.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-black text-white pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <p className="ml-4 text-gray-400">Chargement...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-black text-white pt-16">
        <p className="text-red-500">Vous devez être connecté pour accéder à cette page.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white py-12 pt-24">
      <div className="container mx-auto px-4">
        <Card className="bg-gray-900 border-gray-800 text-white max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-gold text-2xl">Changer le mot de passe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="currentPassword" className="text-white">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-white">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmNewPassword" className="text-white">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-4">
                <Button type="submit" className="bg-gold text-black hover:bg-gold/90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changement...
                    </>
                  ) : (
                    'Changer le mot de passe'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/profile')}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
