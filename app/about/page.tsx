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
            Retour à l'accueil
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gold">À Propos</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">À PROPOS DE SAVAGE RISE</h1>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Savage Rise est bien plus qu’une marque de vêtements. C’est l’expression d’un style audacieux, d’une élégance brute et d’une identité affirmée. Pensée pour celles et ceux qui n’acceptent aucun compromis entre qualité, esthétique et singularité, chaque pièce incarne un équilibre entre modernité urbaine et raffinement intemporel.
            </p>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Conçue avec exigence, notre collection reflète un engagement profond envers l’artisanat, les matières nobles et le design minimaliste. Entrez dans l’univers Savage Rise, là où le luxe rencontre l’attitude.
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
