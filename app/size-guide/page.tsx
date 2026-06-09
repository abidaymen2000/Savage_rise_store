import Link from "next/link"
import { ArrowLeft, Ruler } from "lucide-react"

const sizeRows = [
  { size: "XS", chest: "84-89 cm", waist: "70-75 cm", hip: "84-89 cm" },
  { size: "S", chest: "90-95 cm", waist: "76-81 cm", hip: "90-95 cm" },
  { size: "M", chest: "96-101 cm", waist: "82-87 cm", hip: "96-101 cm" },
  { size: "L", chest: "102-107 cm", waist: "88-93 cm", hip: "102-107 cm" },
  { size: "XL", chest: "108-113 cm", waist: "94-99 cm", hip: "108-113 cm" },
  { size: "XXL", chest: "114-119 cm", waist: "100-105 cm", hip: "114-119 cm" },
]

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Ruler className="h-7 w-7 text-gold" />
            <h1 className="text-4xl md:text-5xl font-playfair font-bold">Size guide</h1>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Use this guide as a reference. Product cuts can vary slightly depending on fabric, silhouette, and intended fit.
          </p>
        </div>

        <div className="overflow-x-auto border border-gray-800 rounded-lg mb-10">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-gray-900 text-gold">
              <tr>
                <th className="p-4 font-semibold">Size</th>
                <th className="p-4 font-semibold">Chest</th>
                <th className="p-4 font-semibold">Waist</th>
                <th className="p-4 font-semibold">Hip</th>
              </tr>
            </thead>
            <tbody>
              {sizeRows.map((row) => (
                <tr key={row.size} className="border-t border-gray-800">
                  <td className="p-4 font-semibold text-white">{row.size}</td>
                  <td className="p-4 text-gray-300">{row.chest}</td>
                  <td className="p-4 text-gray-300">{row.waist}</td>
                  <td className="p-4 text-gray-300">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="max-w-3xl border border-gray-800 bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">How to measure</h2>
          <p className="text-gray-400 leading-relaxed">
            Measure close to the body with a flexible tape. If you are between two sizes, choose the larger size for a relaxed fit or the smaller size for a sharper fit.
          </p>
        </section>
      </div>
    </main>
  )
}
