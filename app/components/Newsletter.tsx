"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">RESTEZ INFORMÉ</h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Soyez les premiers à découvrir nos nouvelles collections, nos événements exclusifs et nos offres privilégiées.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <Input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            required
          />
          <Button type="submit" className="bg-gold text-black hover:bg-gold/90 font-semibold px-8">
            S'ABONNER
          </Button>
        </form>

        <p className="text-gray-500 text-sm mt-4">
          En vous abonnant, vous acceptez de recevoir nos communications marketing.
        </p>
      </div>
    </section>
  )
}
