"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Heart, Star, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import type { Order, WishlistItem } from "@/types/api"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingWishlist, setLoadingWishlist] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
      fetchWishlist()
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      const data = await api.getMyOrders()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const fetchWishlist = async () => {
    try {
      const data = await api.getWishlist()
      setWishlist(data)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    } finally {
      setLoadingWishlist(false)
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600"
      case "confirmed":
        return "bg-blue-600"
      case "shipped":
        return "bg-purple-600"
      case "delivered":
        return "bg-green-600"
      case "cancelled":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "confirmed":
        return "Confirmée"
      case "shipped":
        return "Expédiée"
      case "delivered":
        return "Livrée"
      case "cancelled":
        return "Annulée"
      default:
        return status
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      await api.cancelOrder(orderId)
      fetchOrders() // Refresh orders
    } catch (error) {
      console.error("Error cancelling order:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold">Mon Profil</h1>
            <p className="text-gray-400">Bienvenue, {user.full_name || user.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900">
            <TabsTrigger value="orders" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Package className="h-4 w-4 mr-2" />
              Commandes
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Star className="h-4 w-4 mr-2" />
              Avis
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Mes Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                    <p className="text-gray-400">Chargement des commandes...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Aucune commande trouvée</p>
                    <Link href="/products">
                      <Button className="bg-gold text-black hover:bg-gold/90">Découvrir nos produits</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold text-white">Commande #{order.id.slice(-8)}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(order.created_at).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                              {getStatusText(order.status)}
                            </Badge>
                            <p className="text-gold font-semibold mt-1">{formatPrice(order.total_amount)}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm text-gray-300">
                              {item.qty}x Produit {item.product_id} - {item.color} ({item.size})
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/profile/orders/${order.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                            >
                              Voir détails
                            </Button>
                          </Link>
                          {order.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                              className="border-red-600 text-red-400 hover:bg-red-900/20"
                            >
                              Annuler
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Ma Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingWishlist ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                    <p className="text-gray-400">Chargement de la wishlist...</p>
                  </div>
                ) : wishlist.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Votre wishlist est vide</p>
                    <Link href="/products">
                      <Button className="bg-gold text-black hover:bg-gold/90">Découvrir nos produits</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border border-gray-700 rounded-lg p-4">
                        <p className="text-white">Produit {item.product_id}</p>
                        <p className="text-sm text-gray-400">
                          Ajouté le {new Date(item.added_at).toLocaleDateString("fr-FR")}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                          onClick={() => api.removeFromWishlist(item.product_id).then(fetchWishlist)}
                        >
                          Retirer
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Mes Avis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Fonctionnalité en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Paramètres du compte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Email</label>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Nom complet</label>
                    <p className="text-white">{user.full_name || "Non renseigné"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Statut du compte</label>
                    <Badge className={user.is_active ? "bg-green-600" : "bg-red-600"}>
                      {user.is_active ? "Vérifié" : "Non vérifié"}
                    </Badge>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="space-y-2">
                     <Link href="/profile/edit">
                    <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                      Modifier le profil
                    </Button>
                    </Link>
                     <Link href="/profile/change-password">
                    <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                      Changer le mot de passe
                    </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
