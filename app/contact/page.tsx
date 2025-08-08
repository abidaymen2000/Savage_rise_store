"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, XCircle } from 'lucide-react'
import { useCallback, useState } from 'react'
import { api } from '@/lib/api'
import { Alert, AlertDescription } from '@/components/ui/alert'

type Notification = {
  type: "success" | "error"
  message: string
}


export default function ContactPage() {
  const [notification, setNotification] = useState<Notification | null>(null)

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries()) as {
      full_name: string
      email: string
      subject: string
      message: string
    }
    try {
      await api.sendContact({
        full_name: data.full_name,
        email:     data.email,
        subject:   data.subject,
        message:   data.message,
      })
 form.reset()
      setNotification({
        type: "success",
        message: "Votre message a bien été envoyé, nous vous répondrons sous peu."
      })
    } catch (err) {
      console.error(err)
      setNotification({
        type: "error",
        message: "Échec de l’envoi, réessayez plus tard."
      })
    }
  }, [])
  return (
    <main className="min-h-screen bg-black text-white py-12 pt-24">
      <div className="container mx-auto px-4">
                {/* ─────────────── Notification ─────────────────── */}
        {notification && (
          <div className="fixed top-24 right-4 z-50 w-full max-w-sm">
            <Alert
              variant={notification.type === "success" ? "default" : "destructive"}
              className="mb-4"
            >
              <AlertDescription className="pr-8">
                {notification.message}
              </AlertDescription>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setNotification(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </Alert>
          </div>
        )}
        {/* ───────────────────────────────────────────────── */}

        <h1 className="text-4xl font-bold text-gold mb-8 text-center">Contactez-nous</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-gold">Envoyez-nous un message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="full_name" className="text-white">Nom complet</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Votre nom"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Votre email"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-white">Sujet</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Sujet de votre message"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-white">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Votre message..."
                    rows={5}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <Button type="submit" className="bg-gold text-black hover:bg-gold/90 w-full">
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-gold">Nos coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-gold" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-300">Savage.rise.tn@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-gold" />
                <div>
                  <p className="font-semibold">Téléphone</p>
                  <p className="text-gray-300">+216 21 461 637</p>
                </div>
              </div>
              {/* <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-gold" />
                <div>
                  <p className="font-semibold">Adresse</p>
                  <p className="text-gray-300">123 Rue de la Mode</p>
                  <p className="text-gray-300">75001 Paris, France</p>
                </div>
              </div> */}
              {/* You can embed a map here if desired */}
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe
                  title="Carte de Sfax"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000!2d10.698422!3d34.740556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd71381aec5a5f%3A0x27268cbb18b19e0!2sSfax%2C%20Tunisie!5e0!3m2!1sfr!2sus!4v1691400000000!5m2!1sfr!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
