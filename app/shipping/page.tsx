import Link from "next/link"
import { ArrowLeft, MapPin, PackageCheck, Truck } from "lucide-react"

const shippingSteps = [
  {
    icon: PackageCheck,
    title: "Order preparation",
    text: "Orders are checked, prepared, and packed with care before being handed to delivery.",
  },
  {
    icon: Truck,
    title: "Delivery",
    text: "Shipping fees are calculated at checkout based on the delivery city, country, and order total.",
  },
  {
    icon: MapPin,
    title: "Address accuracy",
    text: "Please make sure your phone number, city, and address are correct to avoid delivery delays.",
  },
]

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Shipping</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Shipping is calculated dynamically during checkout, so the final amount always reflects the active delivery rate for your address.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {shippingSteps.map((item) => (
            <section key={item.title} className="border border-gray-800 bg-gray-900 p-6 rounded-lg">
              <item.icon className="h-6 w-6 text-gold mb-4" />
              <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
              <p className="text-gray-400 leading-relaxed">{item.text}</p>
            </section>
          ))}
        </div>

        <section className="max-w-3xl border border-gray-800 bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Important notes</h2>
          <p className="text-gray-400 leading-relaxed">
            Delivery times can vary depending on product availability and destination. If there is any issue with your address or phone number, our team may contact you before dispatch.
          </p>
        </section>
      </div>
    </main>
  )
}
