"use client"

import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"
import { useState, useEffect } from "react"

export default function Footer() {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking")

  useEffect(() => {
    async function checkApiStatus() {
      try {
        const response = await fetch("http://localhost:8000/products/?skip=0&limit=1")
        setApiStatus(response.ok ? "online" : "offline")
      } catch {
        setApiStatus("offline")
      }
    }

    checkApiStatus()
  }, [])

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                apiStatus === "online" ? "bg-green-500" : apiStatus === "offline" ? "bg-yellow-500" : "bg-gray-500"
              }`}
            ></div>
            <span className="text-gray-500">
              API Status:{" "}
              {apiStatus === "online" ? "Connecté" : apiStatus === "offline" ? "Mode démo" : "Vérification..."}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-playfair font-bold text-gold mb-4">SAVAGE RISE</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              L'excellence de la mode masculine contemporaine. Chaque pièce raconte une histoire d'élégance et de
              sophistication.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">NAVIGATION</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/collections" className="text-gray-400 hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/nouveautes" className="text-gray-400 hover:text-white transition-colors">
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">SERVICE CLIENT</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/aide" className="text-gray-400 hover:text-white transition-colors">
                  Aide
                </Link>
              </li>
              <li>
                <Link href="/livraison" className="text-gray-400 hover:text-white transition-colors">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/retours" className="text-gray-400 hover:text-white transition-colors">
                  Retours
                </Link>
              </li>
              <li>
                <Link href="/taille" className="text-gray-400 hover:text-white transition-colors">
                  Guide des tailles
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2024 Savage Rise. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/mentions-legales" className="text-gray-500 hover:text-white text-sm transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-gray-500 hover:text-white text-sm transition-colors">
              Confidentialité
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
