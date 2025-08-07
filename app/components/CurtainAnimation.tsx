"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CurtainAnimationProps {
  onComplete: () => void
}

export default function CurtainAnimation({ onComplete }: CurtainAnimationProps) {
  const [stage, setStage] = useState<"curtains" | "logo" | "complete">("curtains")

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage("logo")
    }, 1500) // Rideaux s'ouvrent après 1500ms (au lieu de 1000ms)

    const timer2 = setTimeout(() => {
      setStage("complete")
      setTimeout(onComplete, 500)
    }, 5000) // Animation complète après 5 secondes (au lieu de 3.5 secondes)

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

          {/* Left Curtain */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full"
            initial={{ x: 0 }}
            animate={{ x: stage === "curtains" ? 0 : "-100%" }}
            transition={{ 
              duration: 2.0, // Augmenté de 1.5s
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3 
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-black via-gray-900 to-gold/10 relative">
              {/* Curtain Texture */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent"
                    style={{ left: `${(i * 2)}%` }}
                  />
                ))}
              </div>
              
              {/* Curtain Rod */}
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-gold via-yellow-600 to-gold shadow-lg" />
              
              {/* Curtain Folds */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-4 w-full h-full bg-gradient-to-b from-gold/5 to-transparent"
                    style={{ 
                      left: `${i * 12.5}%`,
                      width: '12.5%',
                      clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'
                    }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Curtain */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full"
            initial={{ x: 0 }}
            animate={{ x: stage === "curtains" ? 0 : "100%" }}
            transition={{ 
              duration: 2.0, // Augmenté de 1.5s
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3 
            }}
          >
            <div className="w-full h-full bg-gradient-to-l from-black via-gray-900 to-gold/10 relative">
              {/* Curtain Texture */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent"
                    style={{ left: `${(i * 2)}%` }}
                  />
                ))}
              </div>
              
              {/* Curtain Rod */}
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-gold via-yellow-600 to-gold shadow-lg" />
              
              {/* Curtain Folds */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-4 w-full h-full bg-gradient-to-b from-gold/5 to-transparent"
                    style={{ 
                      left: `${i * 12.5}%`,
                      width: '12.5%',
                      clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)'
                    }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Central Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              {stage === "logo" && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.2, rotateY: 90 }}
                  transition={{ 
                    duration: 1.5, // Augmenté de 1s
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <motion.div
                    className="relative"
                    animate={{
                      rotateY: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <h1 className="text-7xl md:text-9xl font-playfair font-bold text-gold mb-6 relative">
                      <span className="relative z-10">SAVAGE RISE</span>
                      <motion.div
                        className="absolute inset-0 text-gold/20 blur-sm"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        SAVAGE RISE
                      </motion.div>
                    </h1>
                  </motion.div>
                  
                  <motion.p 
                    className="text-2xl md:text-3xl text-white font-light tracking-widest"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    Entrez dans l'excellence
                  </motion.p>

                  {/* Spotlight Effect */}
                  <motion.div
                    className="absolute -inset-32 bg-gradient-radial from-gold/20 via-gold/5 to-transparent rounded-full blur-2xl"
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
</merged_code>
