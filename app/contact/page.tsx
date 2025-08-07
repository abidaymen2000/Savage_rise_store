import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white py-12 pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gold mb-8 text-center">Contactez-nous</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-gold">Envoyez-nous un message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-white">Nom complet</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Votre nom"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Votre email"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-white">Sujet</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Sujet de votre message"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-white">Message</Label>
                  <Textarea
                    id="message"
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
                  <p className="text-gray-300">support@savagerise.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-gold" />
                <div>
                  <p className="font-semibold">Téléphone</p>
                  <p className="text-gray-300">+33 1 23 45 67 89</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-gold" />
                <div>
                  <p className="font-semibold">Adresse</p>
                  <p className="text-gray-300">123 Rue de la Mode</p>
                  <p className="text-gray-300">75001 Paris, France</p>
                </div>
              </div>
              {/* You can embed a map here if desired */}
              <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                Carte ici (ex: Google Maps embed)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
