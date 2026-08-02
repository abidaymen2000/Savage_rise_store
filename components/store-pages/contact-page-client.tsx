"use client"

import Link from "next/link"
import { useCallback, useMemo, useState } from "react"
import { ArrowLeft, Mail, MessageCircle, Phone, XCircle } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStoreConfig } from "@/contexts/StoreConfigContext"
import { api } from "@/lib/api"
import type { StorePageMapBlock, StorePagePublicOut } from "@/lib/api/generated"
import { getValidSocialLinks } from "@/lib/store-config-shared"
import { trackMetaPixelEvent } from "@/lib/meta-pixel"
import { trackEvent } from "@/lib/store-analytics"

type Notification = {
  type: "success" | "error"
  message: string
}

export function ContactPageClient({ page }: { page: StorePagePublicOut | null }) {
  const [notification, setNotification] = useState<Notification | null>(null)
  const { config } = useStoreConfig()
  const whatsapp = getValidSocialLinks(config.social_links).find((social) => social.platform === "whatsapp")
  const mapBlock = useMemo(
    () => page?.content_blocks?.find((block) => block.type === "map" && "embed_url" in block) as StorePageMapBlock | undefined,
    [page?.content_blocks],
  )

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries()) as {
      full_name: string
      email: string
      subject: string
      message: string
    }

    try {
      await api.sendContact({
        full_name: data.full_name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      })
      trackMetaPixelEvent("Contact", { content_name: "Contact form" })
      trackEvent("button_clicked", {
        metadata: {
          action: "contact_form_submitted",
          subject: data.subject,
        },
      })
      form.reset()
      setNotification({
        type: "success",
        message: "Your message has been sent. We will get back to you shortly.",
      })
    } catch {
      trackEvent("button_clicked", {
        metadata: {
          action: "contact_form_failed",
          subject: data.subject,
        },
      })
      setNotification({
        type: "error",
        message: "Message delivery failed. Please try again later.",
      })
    }
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground py-12 pt-24">
      <div className="container mx-auto px-4">
        {notification && (
          <div className="fixed top-24 right-4 z-50 w-full max-w-sm">
            <Alert variant={notification.type === "success" ? "default" : "destructive"} className="mb-4">
              <AlertDescription className="pr-8">{notification.message}</AlertDescription>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setNotification(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </Alert>
          </div>
        )}

        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground dark:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-accent mb-4">{page?.title || "Contact us"}</h1>
          {page?.subtitle ? <p className="text-muted-foreground text-lg leading-relaxed">{page.subtitle}</p> : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card border-border text-card-foreground">
            <CardHeader>
              <CardTitle className="text-accent">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="full_name" className="text-foreground dark:text-white">Full name</Label>
                  <Input id="full_name" name="full_name" type="text" placeholder="Your name" className="bg-background border-input text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground dark:text-white">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Your email" className="bg-background border-input text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-foreground dark:text-white">Subject</Label>
                  <Input id="subject" name="subject" type="text" placeholder="Message subject" className="bg-background border-input text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <Label htmlFor="message" className="text-foreground dark:text-white">Message</Label>
                  <Textarea id="message" name="message" placeholder="Your message..." rows={5} className="bg-background border-input text-foreground placeholder:text-muted-foreground" />
                </div>
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                  Send message
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground">
            <CardHeader>
              <CardTitle className="text-accent">Contact details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-accent" />
                <div>
                  <p className="font-semibold">Email</p>
                  {config.contact_email ? <a href={`mailto:${config.contact_email}`} className="text-muted-foreground hover:text-accent">{config.contact_email}</a> : <p className="text-muted-foreground">Not available</p>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 text-accent" />
                <div>
                  <p className="font-semibold">Phone</p>
                  {config.contact_phone ? <a href={`tel:${config.contact_phone}`} className="text-muted-foreground hover:text-accent">{config.contact_phone}</a> : <p className="text-muted-foreground">Not available</p>}
                </div>
              </div>
              {whatsapp && (
                <div className="flex items-center gap-4">
                  <MessageCircle className="h-6 w-6 text-accent" />
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <a href={whatsapp.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent">Message us</a>
                  </div>
                </div>
              )}
              {mapBlock?.embed_url ? (
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <iframe
                    title={mapBlock.label || mapBlock.title || "Store map"}
                    src={mapBlock.embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

