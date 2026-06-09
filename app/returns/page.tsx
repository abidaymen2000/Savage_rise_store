import Link from "next/link"
import { ArrowLeft, CheckCircle, PackageOpen, RefreshCcw } from "lucide-react"

const returnRules = [
  {
    icon: CheckCircle,
    title: "Eligibility",
    text: "Items should be unused, clean, and returned with their original packaging and labels.",
  },
  {
    icon: PackageOpen,
    title: "Inspection",
    text: "Returned items are inspected before an exchange, refund, or store credit is confirmed.",
  },
  {
    icon: RefreshCcw,
    title: "Request window",
    text: "Please contact us quickly after receiving your order if you need to request a return or exchange.",
  },
]

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Returns</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            We want every Savage Rise piece to feel right. If something is wrong with your order, contact us and we will help with the next step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {returnRules.map((item) => (
            <section key={item.title} className="border border-gray-800 bg-gray-900 p-6 rounded-lg">
              <item.icon className="h-6 w-6 text-gold mb-4" />
              <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
              <p className="text-gray-400 leading-relaxed">{item.text}</p>
            </section>
          ))}
        </div>

        <section className="max-w-3xl border border-gray-800 bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">How to start a return</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Send us your order reference, the item concerned, and the reason for your request. Our team will confirm the available options.
          </p>
          <Link href="/contact" className="text-gold hover:underline">
            Contact customer service
          </Link>
        </section>
      </div>
    </main>
  )
}
