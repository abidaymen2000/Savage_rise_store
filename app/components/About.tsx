import Image from "next/image"

export default function About() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">THE ART OF CONTEMPORARY ELEGANCE</h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Savage Rise embodies excellence in contemporary, confident, and refined fashion. Every piece is meticulously designed for those who refuse compromise, blending artisanal tradition with modern innovation.
            </p>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Our vision: redefine luxury with boldness and sophistication to create timeless style that transcends trends.
            </p>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gold mb-2">2025</div>
                <div className="text-sm text-gray-400">FOUNDED</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold mb-2">50+</div>
                <div className="text-sm text-gray-400">ARTISANS</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold mb-2">3</div>
                <div className="text-sm text-gray-400">COUNTRIES</div>
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
              <div className="text-sm font-semibold">HANDMADE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
