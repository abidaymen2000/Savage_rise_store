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
    setEmail("")
  }

  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">STAY INFORMED</h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Be the first to discover our new collections, exclusive events, and privileged offers.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            required
          />
          <Button type="submit" className="bg-gold text-black hover:bg-gold/90 font-semibold px-8">
            SUBSCRIBE
          </Button>
        </form>

        <p className="text-gray-500 text-sm mt-4">
          By subscribing, you agree to receive our marketing communications.
        </p>
      </div>
    </section>
  )
}
