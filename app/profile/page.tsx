"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Heart, Star, Settings, LogOut, StarIcon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import type { Order, Product, Review, WishlistItem } from "@/types/api"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Tab = "orders" | "wishlist" | "reviews" | "settings";
type WishlistWithProduct = WishlistItem & { product?: Product }
export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistWithProduct[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingWishlist, setLoadingWishlist] = useState(true)

  // NEW: états pour les avis
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [editing, setEditing] = useState<Review | null>(null)
  const [form, setForm] = useState<{ rating: number; title: string; comment: string }>({ rating: 5, title: "", comment: "" })
  const [toDelete, setToDelete] = useState<Review | null>(null)

  // onglet depuis l'URL ou "orders" par défaut
  const qp = searchParams.get("tab");
  const allowed: Tab[] = ["orders", "wishlist", "reviews", "settings"];
  const urlTab = (searchParams.get("tab") as Tab) ?? "orders";
  const [activeTab, setActiveTab] = useState<Tab>(urlTab);


  // si l'URL change (ex: /profile?tab=wishlist), on met à jour l'état
  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
      fetchWishlist()
      fetchReviews()
    }
  }, [isAuthenticated])

  function openEdit(r: Review) {
    setEditing(r)
    setForm({
      rating: r.rating,
      title: r.title ?? "",
      comment: r.comment ?? ""
    })
  }

  async function saveEdit() {
    if (!editing) return
    const updated = await api.updateReview(editing.product_id, editing.id, {
      rating: form.rating, title: form.title || null, comment: form.comment || null
    })
    setReviews(reviews.map(r => r.id === updated.id ? updated : r))
    setEditing(null)
  }

  async function confirmDelete() {
    if (!toDelete) return
    await api.deleteReview(toDelete.product_id, toDelete.id)
    setReviews(reviews.filter(r => r.id !== toDelete.id))
    setToDelete(null)
  }

  // NEW: fetch des avis
  const fetchReviews = async () => {
    try {
      const data = await api.getMyReviews()
      setReviews(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoadingReviews(false)
    }
  }

  // utilitaire pour étoiles
  const Stars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${i <= rating ? "text-gold" : "text-gray-600"}`}
          fill={i <= rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  )

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
      setLoadingWishlist(true)
      const raw = await api.getWishlist() // <- WishlistItem[]
      const enriched: WishlistWithProduct[] = await Promise.all(
        raw.map(async (w) => {
          try {
            const product = await api.getProduct(w.product_id)
            return { ...w, product }
          } catch {
            return { ...w } // si le produit n'est pas trouvé
          }
        })
      )
      setWishlist(enriched)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      setWishlist([])
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

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            const t = v as Tab;
            setActiveTab(t);
            // garde l’URL en phase avec l’onglet
            router.replace(`/profile?tab=${t}`, { scroll: false });
          }}
          className="space-y-6"
        >
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
                      <div
                        key={item.id}
                        role="button"
                        onClick={() => router.push(`/products/${item.product_id}`)}
                        className="border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-gold/60 transition-colors"
                      >
                        <p className="text-white">
                          {item.product?.name ?? `Produit ${item.product_id}`}
                        </p>
                        <p className="text-sm text-gray-400">
                          Ajouté le {new Date(item.added_at).toLocaleDateString("fr-FR")}
                        </p>

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation() // évite la navigation quand on clique sur le bouton
                            api.removeFromWishlist(item.product_id).then(fetchWishlist)
                          }}
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
              <CardHeader><CardTitle className="text-white">Mes Avis</CardTitle></CardHeader>
              <CardContent>
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4" />
                    <p className="text-gray-400">Chargement des avis...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Vous n’avez pas encore laissé d’avis.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(r => (
                      <div key={r.id} className="border border-gray-700 rounded-lg p-4 flex items-start justify-between">
                        <div>
                          {/* étoiles */}
                          <div className="flex items-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} className={`h-4 w-4 ${i <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                            ))}
                          </div>
                          {r.title && <p className="text-white font-medium">{r.title}</p>}
                          {r.comment && <p className="text-gray-300 text-sm">{r.comment}</p>}
                          <a href={`/products/${r.product_id}`} className="text-gold text-sm underline mt-2 inline-block">Voir le produit</a>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent" onClick={() => openEdit(r)}>
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent" onClick={() => setToDelete(r)}>
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dialog édition */}
            <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
              <DialogContent className="bg-gray-900 border-gray-800 text-white">
                <DialogHeader><DialogTitle>Modifier mon avis</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button key={i} onClick={() => setForm(f => ({ ...f, rating: i }))}>
                        <Star className={`h-6 w-6 ${i <= form.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                      </button>
                    ))}
                  </div>
                  <Input placeholder="Titre (optionnel)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="bg-gray-800 border-gray-700" />
                  <Textarea placeholder="Commentaire (optionnel)" rows={4} value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} className="bg-gray-800 border-gray-700" />
                </div>
                <DialogFooter>
                  <Button variant="outline" className="border-gray-600 text-white bg-transparent" onClick={() => setEditing(null)}>Annuler</Button>
                  <Button className="bg-gold text-black hover:bg-gold/90" onClick={saveEdit}>Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Confirmation suppression */}
            <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
              <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
                <AlertDialogHeader><AlertDialogTitle>Supprimer cet avis ?</AlertDialogTitle></AlertDialogHeader>
                <p className="text-gray-300 text-sm">Cette action est irréversible.</p>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-gray-600 text-white">Annuler</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>Supprimer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
