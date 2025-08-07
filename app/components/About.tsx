import Image from "next/image"

export default function About() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">L'ART DE L'ÉLÉGANCE MASCULINE</h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Savage Rise incarne l'excellence de la mode masculine contemporaine. Chaque pièce est méticuleusement conçue pour l'homme qui refuse les compromis, alliant tradition artisanale et innovation moderne.
            </p>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Notre vision : redéfinir les codes du luxe masculin avec audace et sophistication, pour créer un style intemporel qui transcende les tendances.
            </p>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gold mb-2">2019</div>
                <div className="text-sm text-gray-400">FONDATION</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold mb-2">50+</div>
                <div className="text-sm text-gray-400">ARTISANS</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold mb-2">15</div>
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
