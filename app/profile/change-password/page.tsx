'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { PasswordChange } from '@/types/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/store-analytics'

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
        title: 'Error',
        description: 'You must be signed in to change your password.',
        variant: 'destructive',
      })
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.')
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
        title: 'Success',
        description: 'Your password has been updated successfully.',
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      trackEvent("button_clicked", {
        metadata: {
          action: "password_changed",
        },
      })
      router.push('/profile')
    } catch (err: any) {
      trackEvent("button_clicked", {
        metadata: {
          action: "password_change_failed",
        },
      })
      setError(err.message || 'Password change failed.')
      toast({
        title: 'Error',
        description: err.message || 'Unable to change your password.',
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
        <p className="ml-4 text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-black text-white pt-16">
        <p className="text-red-500">You must be signed in to access this page.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white py-12 pt-24">
      <div className="container mx-auto px-4">
        <Card className="bg-gray-900 border-gray-800 text-white max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-gold text-2xl">Change password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="currentPassword" className="text-white">Current password</Label>
                <PasswordInput
                  id="currentPassword"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-white">New password</Label>
                <PasswordInput
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmNewPassword" className="text-white">Confirm new password</Label>
                <PasswordInput
                  id="confirmNewPassword"
                  placeholder="Confirm new password"
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
                      Updating...
                    </>
                  ) : (
                    'Change password'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/profile')}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
