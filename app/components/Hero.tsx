"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'

export default function Hero() {
const [currentSlide, setCurrentSlide] = useState(0)

const slides = [
  {
    type: "video" as const,
    src: "https://ik.imagekit.io/deuxug3j0/store-savage-rise/video-header.mp4?updatedAt=1754345500707",
    title: "NOUVELLE COLLECTION",
    subtitle: "AUTOMNE/HIVER 2025",
    description: "Découvrez l'élégance redéfinie",
  },
  {
    type: "image" as const,
    src: "https://ik.imagekit.io/deuxug3j0/store-savage-rise/banniere-blan.jpeg?updatedAt=1754345638832",
    title: "STYLE INTEMPOREL",
    subtitle: "PREMIUM",
    description: "Les détails qui font la différence",
  },
]

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, 8000) // Longer duration for video
  return () => clearInterval(timer)
}, [slides.length])

return (
  <section className="relative h-screen overflow-hidden">
    {slides.map((slide, index) => (
      <div
        key={index}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          index === currentSlide ? "opacity-100" : "opacity-0"
        }`}
      >
        {slide.type === "video" ? (
          <video
            src={slide.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onLoadStart={() => console.log("Video loading started")}
            onError={(e) => console.error("Video error:", e)}
          />
        ) : (
          <img src={slide.src || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>
    ))}

    <div className="relative z-10 h-full flex items-center justify-center text-center">
      <div className="max-w-4xl px-4">
        <div className="animate-fade-in">
          <p className="text-gold text-sm tracking-[0.3em] mb-4 font-light">{slides[currentSlide].subtitle}</p>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 leading-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">{slides[currentSlide].description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gold text-black hover:bg-gold/90 font-semibold px-8 py-3 text-lg">
              DÉCOUVRIR
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg bg-transparent"
            >
              LOOKBOOK
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Slide Indicators */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
      {slides.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-gold" : "bg-white/50"}`}
        />
      ))}
    </div>
  </section>
)
}
