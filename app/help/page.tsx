import Link from "next/link"
import { ArrowLeft, Mail, MessageCircle, Package, RefreshCcw } from "lucide-react"

const helpItems = [
  {
    icon: Package,
    title: "Orders",
    text: "After checkout, you receive an email confirmation with your order reference. Signed-in customers can also follow orders from their profile.",
  },
  {
    icon: RefreshCcw,
    title: "Changes and cancellations",
    text: "If your order is still pending, contact us as soon as possible so we can update or cancel it before preparation.",
  },
  {
    icon: MessageCircle,
    title: "Product advice",
    text: "Need help choosing a size, fit, or piece? Send us your question and we will guide you before purchase.",
  },
]

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Help</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Find quick answers about orders, account access, product advice, and customer support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {helpItems.map((item) => (
            <section key={item.title} className="border border-gray-800 bg-gray-900 p-6 rounded-lg">
              <item.icon className="h-6 w-6 text-gold mb-4" />
              <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
              <p className="text-gray-400 leading-relaxed">{item.text}</p>
            </section>
          ))}
        </div>

        <section className="border border-gold/30 bg-gold/10 p-6 rounded-lg max-w-3xl">
          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-gold mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gold mb-2">Still need help?</h2>
              <p className="text-gray-300 mb-4">
                Contact our team and include your order reference if your question is about an existing order.
              </p>
              <Link href="/contact" className="text-gold hover:underline">
                Contact customer service
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
