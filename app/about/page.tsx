import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  return (
    <section className="py-20 bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gold">About</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">ABOUT SAVAGE RISE</h1>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Savage Rise is more than a clothing brand. It is the expression of bold style, raw elegance, and a clear identity. Designed for those who accept no compromise between quality, aesthetics, and individuality, every piece balances urban modernity with timeless refinement.
            </p>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Crafted with precision, our collection reflects a deep commitment to craftsmanship, premium materials, and minimalist design. Step into the Savage Rise universe, where luxury meets attitude.
            </p>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gold mb-2">2025</div>
                <div className="text-sm text-gray-400">FONDATION</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold mb-2">50+</div>
                <div className="text-sm text-gray-400">ARTISANS</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold mb-2">3</div>
                <div className="text-sm text-gray-400">PAYS</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="https://ik.imagekit.io/deuxug3j0/store-savage-rise/logo-blanc.png?updatedAt=1754345640975"
              alt="Savage Rise Atelier"
              width={500}
              height={600}
              className="rounded-lg"
            />
            <div className="absolute -bottom-6 -left-6 bg-gold text-black p-6 rounded-lg">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm font-semibold">FAIT MAIN</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
