"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Heart, ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react"
import { api } from "@/lib/api"
import { useCart } from "@/contexts/CartContext"
import type { Product } from "@/types/api"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        console.log("Fetching product:", productId)
        const data = await api.getProduct(productId)
        console.log("Product loaded:", data.name)
        setProduct(data)
        // Set default color if available
        if (data.zip_color_options && data.zip_color_options.length > 0) {
          setSelectedColor(data.zip_color_options[0])
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(err instanceof Error ? err.message : "Erreur lors du chargement du produit")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedColor, selectedSize)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
              <p className="text-gray-400">Chargement du produit...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-400 mb-4">Erreur: {error || "Produit non trouvé"}</p>
            <Link href="/products">
              <Button className="bg-gold text-black hover:bg-gold/90">Retour aux produits</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/products" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux produits
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-900">
              <Image
                src={product.images[selectedImageIndex]?.url || "/placeholder.svg?height=600&width=600"}
                alt={product.images[selectedImageIndex]?.alt_text || product.name}
                fill
                className="object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square relative overflow-hidden rounded-lg ${
                      selectedImageIndex === index ? "ring-2 ring-gold" : ""
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-gray-400 mb-4">{product.full_name}</p>
              <p className="text-3xl font-bold text-gold">{product.price.toFixed(2)} €</p>
            </div>

            {/* Stock Status */}
            <div>
              {product.in_stock ? (
                <Badge className="bg-green-600 text-white">En stock</Badge>
              ) : (
                <Badge className="bg-red-600 text-white">Rupture de stock</Badge>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Color Selection */}
            {product.zip_color_options && product.zip_color_options.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Couleur</h3>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Choisir une couleur" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {product.zip_color_options.map((color) => (
                      <SelectItem key={color} value={color} className="text-white">
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Taille</h3>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Choisir une taille" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <SelectItem key={size} value={size} className="text-white">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantité</h3>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
                <SelectTrigger className="w-24 bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-white">
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-1 bg-gold text-black hover:bg-gold/90 font-semibold py-3"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Ajouter au panier
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Details */}
            <Separator className="bg-gray-700" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Détails du produit</h3>

              {product.fabric && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Tissu:</span>
                  <span>{product.fabric}</span>
                </div>
              )}

              {product.composition && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Composition:</span>
                  <span>
                    {Object.entries(product.composition)
                      .map(([material, percentage]) => `${material} ${percentage}%`)
                      .join(", ")}
                  </span>
                </div>
              )}

              {product.care_instructions && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Entretien:</span>
                  <span>{product.care_instructions}</span>
                </div>
              )}

              {product.sku && (
                <div className="flex justify-between">
                  <span className="text-gray-400">SKU:</span>
                  <span>{product.sku}</span>
                </div>
              )}
            </div>

            {/* Services */}
            <Separator className="bg-gray-700" />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gold" />
                <span>Livraison gratuite dès 200€</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-gold" />
                <span>Retours gratuits sous 30 jours</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gold" />
                <span>Garantie qualité 2 ans</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
