import Hero from "./components/Hero"
import FeaturedProducts from "./components/FeaturedProducts"
import About from "./components/About"
import Newsletter from "./components/Newsletter"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <FeaturedProducts />
      <About />
      <Newsletter />
    </main>
  )
}
