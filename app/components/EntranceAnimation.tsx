"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EntranceAnimationProps {
  onComplete: () => void
}

export default function EntranceAnimation({ onComplete }: EntranceAnimationProps) {
  const [stage, setStage] = useState<"doors" | "logo" | "complete">("doors")

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage("logo")
    }, 1200) // Portes s'ouvrent après 1200ms (au lieu de 800ms)

    const timer2 = setTimeout(() => {
      setStage("complete")
      setTimeout(onComplete, 500)
    }, 4500) // Animation complète après 4.5 secondes (au lieu de 3 secondes)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {stage !== "complete" && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />

          {/* Left Door */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-black via-gray-900 to-gold/20 border-r-4 border-gold/30"
            initial={{ x: 0 }}
            animate={{ x: stage === "doors" ? 0 : "-100%" }}
            transition={{ 
              duration: 1.8, // Augmenté de 1.2s
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2 
            }}
          >
            {/* Door Handle */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <div className="w-6 h-16 bg-gold rounded-full shadow-lg shadow-gold/50" />
              <div className="w-4 h-4 bg-gold rounded-full mt-2 ml-1 shadow-lg shadow-gold/50" />
            </div>
            
            {/* Door Pattern */}
            <div className="absolute inset-4 border-2 border-gold/20 rounded-lg">
              <div className="absolute inset-4 border border-gold/10 rounded-lg">
                <div className="w-full h-full bg-gradient-to-br from-transparent via-gold/5 to-transparent rounded-lg" />
              </div>
            </div>

            {/* Luxury Pattern */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 opacity-10">
              <div className="w-full h-full bg-gradient-radial from-gold/30 to-transparent rounded-full" />
            </div>
          </motion.div>

          {/* Right Door */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black via-gray-900 to-gold/20 border-l-4 border-gold/30"
            initial={{ x: 0 }}
            animate={{ x: stage === "doors" ? 0 : "100%" }}
            transition={{ 
              duration: 1.8, // Augmenté de 1.2s
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2 
            }}
          >
            {/* Door Handle */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
              <div className="w-6 h-16 bg-gold rounded-full shadow-lg shadow-gold/50" />
              <div className="w-4 h-4 bg-gold rounded-full mt-2 ml-1 shadow-lg shadow-gold/50" />
            </div>
            
            {/* Door Pattern */}
            <div className="absolute inset-4 border-2 border-gold/20 rounded-lg">
              <div className="absolute inset-4 border border-gold/10 rounded-lg">
                <div className="w-full h-full bg-gradient-to-bl from-transparent via-gold/5 to-transparent rounded-lg" />
              </div>
            </div>

            {/* Luxury Pattern */}
            <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 opacity-10">
              <div className="w-full h-full bg-gradient-radial from-gold/30 to-transparent rounded-full" />
            </div>
          </motion.div>

          {/* Central Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              {stage === "logo" && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1, y: -20 }}
                  transition={{
                    duration: 1.2, // Augmenté de 0.8s
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  {/* Main Logo */}
                  <motion.h1 
                    className="text-6xl md:text-8xl font-playfair font-bold text-gold mb-4"
                    initial={{ letterSpacing: "0.5em", opacity: 0 }}
                    animate={{ letterSpacing: "0.1em", opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    SAVAGE RISE
                  </motion.h1>
                  
                  {/* Welcome Text */}
                  <motion.p 
                    className="text-xl md:text-2xl text-white font-light tracking-widest mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    Bienvenue dans l'univers du luxe masculin
                  </motion.p>

                  {/* Decorative Elements */}
                  <motion.div 
                    className="flex items-center justify-center space-x-4"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                    <div className="w-2 h-2 bg-gold rounded-full shadow-lg shadow-gold/50" />
                    <div className="w-16 h-px bg-gradient-to-l from-transparent via-gold to-transparent" />
                  </motion.div>

                  {/* Subtitle */}
                  <motion.p 
                    className="text-sm text-gray-400 mt-6 tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1 }}
                  >
                    EXCELLENCE • ÉLÉGANCE • SOPHISTICATION
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Light Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === "logo" ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-gold/10 via-gold/5 to-transparent rounded-full blur-3xl" />
          </motion.div>

          {/* Particles Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gold/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
