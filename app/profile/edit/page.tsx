'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { UserUpdate } from '@/types/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EditProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      setFullName(user.full_name || '')
      setEmail(user.email || '')
    }
  }, [user, isAuthenticated, authLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour modifier votre profil.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      const updatedData: UserUpdate = {
        full_name: fullName,
        email: email,
      }
      await api.updateProfile(updatedData)
      await refreshUser() // Refresh user data in context
      toast({
        title: 'Succès',
        description: 'Votre profil a été mis à jour avec succès.',
      })
      router.push('/profile')
    } catch (err: any) {
      console.error('Failed to update profile:', err)
      setError(err.message || 'Échec de la mise à jour du profil.')
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de mettre à jour votre profil.',
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
        <p className="ml-4 text-gray-400">Chargement du profil...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
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
            <CardTitle className="text-gold text-2xl">Modifier le profil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="text-white">Nom complet</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer les modifications'
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
