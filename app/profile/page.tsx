// app/profile/page.tsx
"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Coins, Gift, Package, Heart, Star, Settings, LogOut, Star as StarIcon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import type { LoyaltyBalance, Order, Product, Review, WishlistItem } from "@/types/api"
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

type Tab = "orders" | "wishlist" | "reviews" | "loyalty" | "settings"
type WishlistWithProduct = WishlistItem & { product?: Product }

// Règles de livraison (cohérentes avec le panier/checkout)
// --------- tout ton ancien code est ici, mais dans ProfileContent ---------
function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistWithProduct[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingWishlist, setLoadingWishlist] = useState(true)
  const [loyalty, setLoyalty] = useState<LoyaltyBalance | null>(null)
  const [loadingLoyalty, setLoadingLoyalty] = useState(true)

  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [editing, setEditing] = useState<Review | null>(null)
  const [form, setForm] = useState<{ rating: number; title: string; comment: string }>({
    rating: 5,
    title: "",
    comment: "",
  })
  const [toDelete, setToDelete] = useState<Review | null>(null)

  // Map idProduit -> nom pour lister joliment les commandes
  const [productNames, setProductNames] = useState<Record<string, string>>({})

  // onglet depuis l'URL ou "orders" par défaut
  const urlTab = (searchParams.get("tab") as Tab) ?? "orders"
  const [activeTab, setActiveTab] = useState<Tab>(urlTab)

  // si l'URL change (ex: /profile?tab=wishlist), on met à jour l'état
  useEffect(() => {
    setActiveTab(urlTab)
  }, [urlTab])

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
      fetchLoyalty()
    }
  }, [isAuthenticated])

  function openEdit(r: Review) {
    setEditing(r)
    setForm({
      rating: r.rating,
      title: r.title ?? "",
      comment: r.comment ?? "",
    })
  }

  async function saveEdit() {
    if (!editing) return
    const updated = await api.updateReview(editing.product_id, editing.id, {
      rating: form.rating,
      title: form.title || null,
      comment: form.comment || null,
    })
    setReviews(reviews.map((r) => (r.id === updated.id ? updated : r)))
    setEditing(null)
  }

  async function confirmDelete() {
    if (!toDelete) return
    await api.deleteReview(toDelete.product_id, toDelete.id)
    setReviews(reviews.filter((r) => r.id !== toDelete.id))
    setToDelete(null)
  }

  // fetch des avis
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

  const fetchOrders = async () => {
    try {
      const data = await api.getMyOrders()
      setOrders(data)
      await enrichProductNames(data) // <- ajoute les noms produits
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoadingOrders(false)
    }
  }

  // Récupère les noms une seule fois pour tous les produits trouvés dans les commandes
  const enrichProductNames = async (orders: Order[]) => {
    const ids = Array.from(new Set(orders.flatMap((o) => o.items.map((it) => it.product_id))))
    if (ids.length === 0) return

    const entries = await Promise.all(
      ids.map(async (id) => {
        try {
          const p = await api.getProduct(id)
          return [id, p.name] as const
        } catch {
          return [id, `Product ${id.slice(-6)}`] as const
        }
      })
    )

    const map: Record<string, string> = {}
    entries.forEach(([id, name]) => (map[id] = name))
    setProductNames(map)
  }

  const fetchWishlist = async () => {
    try {
      setLoadingWishlist(true)
      const raw = await api.getWishlist()
      const enriched: WishlistWithProduct[] = await Promise.all(
        raw.map(async (w) => {
          try {
            const product = await api.getProduct(w.product_id)
            return { ...w, product }
          } catch {
            return { ...w }
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

  const fetchLoyalty = async () => {
    try {
      setLoadingLoyalty(true)
      const data = await api.getMyLoyaltyBalance(20)
      setLoyalty(data)
    } catch (error) {
      console.error("Error fetching loyalty balance:", error)
      setLoyalty(null)
    } finally {
      setLoadingLoyalty(false)
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
        return "Pending"
      case "confirmed":
        return "Confirmed"
      case "shipped":
        return "Shipped"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  // Total incluant la livraison
  const computeGrandTotal = (order: Order) => {
    return order.total_amount
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      await api.cancelOrder(orderId)
      fetchOrders()
    } catch (error) {
      console.error("Error cancelling order:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) return null

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold">My Profile</h1>
            <p className="text-gray-400">Welcome, {user.full_name || user.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            const t = v as Tab
            setActiveTab(t)
            router.replace(`/profile?tab=${t}`, { scroll: false })
          }}
          className="space-y-6"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 bg-gray-900 sm:grid-cols-5">
            <TabsTrigger value="orders" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Star className="h-4 w-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Coins className="h-4 w-4 mr-2" />
              Points
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">My Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No orders found</p>
                    <Link href="/products">
                      <Button className="bg-gold text-black hover:bg-gold/90">Discover our products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold text-white">Order #{order.id.slice(-8)}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(order.created_at).toLocaleDateString("en-US")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.is_guest ? `Guest - ${order.user_email ?? order.shipping.email}` : "Signed-in customer"}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                              {getStatusText(order.status)}
                            </Badge>
                            {/* Total incluant la livraison */}
                            <p className="text-gold font-semibold mt-1">
                              {formatPrice(computeGrandTotal(order))}
                            </p>
                            <p className="text-xs text-gray-400">
                              Shipping: {order.shipping_amount === 0 ? "Free" : formatPrice(order.shipping_amount ?? 0)}
                              {order.shipping_rate_name ? ` - ${order.shipping_rate_name}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm text-gray-300">
                              {item.qty}x {productNames[item.product_id] ?? `Product ${item.product_id.slice(-6)}`} — {item.color} ({item.size})
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
                              View details
                            </Button>
                          </Link>
                          {order.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                              className="border-red-600 text-red-400 hover:bg-red-900/20"
                            >
                              Cancel
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
                <CardTitle className="text-white">My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingWishlist ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading wishlist...</p>
                  </div>
                ) : wishlist.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Your wishlist is empty</p>
                    <Link href="/products">
                      <Button className="bg-gold text-black hover:bg-gold/90">Discover our products</Button>
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
                        <p className="text-white">{item.product?.name ?? `Product ${item.product_id}`}</p>
                        <p className="text-sm text-gray-400">
                          Added on {new Date(item.added_at).toLocaleDateString("en-US")}
                        </p>

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            api.removeFromWishlist(item.product_id).then(fetchWishlist)
                          }}
                        >
                          Remove
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
                <CardTitle className="text-white">My Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4" />
                    <p className="text-gray-400">Loading reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">You have not left any reviews yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="border border-gray-700 rounded-lg p-4 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <StarIcon key={i} className={`h-4 w-4 ${i <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                            ))}
                          </div>
                          {r.title && <p className="text-white font-medium">{r.title}</p>}
                          {r.comment && <p className="text-gray-300 text-sm">{r.comment}</p>}
                          <a href={`/products/${r.product_id}`} className="text-gold text-sm underline mt-2 inline-block">
                            View product
                          </a>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                            onClick={() => openEdit(r)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                            onClick={() => setToDelete(r)}
                          >
                            Delete
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
                <DialogHeader>
                  <DialogTitle>Edit my review</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button key={i} onClick={() => setForm((f) => ({ ...f, rating: i }))}>
                        <StarIcon className={`h-6 w-6 ${i <= form.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder="Title (optional)"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="bg-gray-800 border-gray-700"
                  />
                  <Textarea
                    placeholder="Comment (optional)"
                    rows={4}
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" className="border-gray-600 text-white bg-transparent" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                  <Button className="bg-gold text-black hover:bg-gold/90" onClick={saveEdit}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Confirmation suppression */}
            <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
              <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                </AlertDialogHeader>
                <p className="text-gray-300 text-sm">This action cannot be undone.</p>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-gray-600 text-white">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Coins className="h-5 w-5 text-gold" />
                  Loyalty points
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingLoyalty ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4" />
                    <p className="text-gray-400">Loading loyalty points...</p>
                  </div>
                ) : loyalty ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg border border-gold/30 bg-gold/10 p-4">
                        <p className="text-sm text-gold">Available points</p>
                        <p className="mt-2 text-3xl font-bold text-white">{loyalty.points_balance}</p>
                      </div>
                      <div className="rounded-lg border border-gray-700 bg-black/30 p-4">
                        <p className="text-sm text-gray-400">Points value</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{formatPrice(loyalty.value_balance)}</p>
                      </div>
                      <div className="rounded-lg border border-gray-700 bg-black/30 p-4">
                        <p className="text-sm text-gray-400">Earn rate</p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {loyalty.settings.earning_percentage ?? 0}%
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-700 bg-black/25 p-4">
                      <div className="flex items-start gap-3">
                        <Gift className="mt-1 h-5 w-5 shrink-0 text-gold" />
                        <div>
                          <p className="font-semibold text-white">How it works</p>
                          <p className="mt-1 text-sm leading-6 text-gray-400">
                            Earn points when your purchases are confirmed. During checkout, choose whether to redeem
                            available points as a discount or keep them for later.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-white">Recent activity</h3>
                      {loyalty.recent_transactions && loyalty.recent_transactions.length > 0 ? (
                        <div className="space-y-3">
                          {loyalty.recent_transactions.map((transaction) => (
                            <div
                              key={transaction.id}
                              className="grid gap-3 rounded-lg border border-gray-700 bg-black/25 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                            >
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge
                                    className={
                                      transaction.type === "earn"
                                        ? "bg-green-600"
                                        : transaction.type === "redeem"
                                          ? "bg-gold text-black"
                                          : "bg-gray-600"
                                    }
                                  >
                                    {transaction.type}
                                  </Badge>
                                  <span className="text-sm text-gray-400">
                                    {new Date(transaction.created_at).toLocaleDateString("en-US")}
                                  </span>
                                </div>
                                {transaction.reason && (
                                  <p className="mt-2 text-sm text-gray-400">{transaction.reason}</p>
                                )}
                              </div>
                              <div className="text-left sm:text-right">
                                <p className={transaction.points >= 0 ? "font-semibold text-green-400" : "font-semibold text-gold"}>
                                  {transaction.points >= 0 ? "+" : ""}
                                  {transaction.points} pts
                                </p>
                                <p className="text-xs text-gray-500">
                                  Balance: {transaction.balance_after} pts
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-gray-700 p-6 text-center">
                          <Coins className="mx-auto mb-3 h-10 w-10 text-gray-600" />
                          <p className="text-gray-400">No loyalty activity yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-red-300">
                    Unable to load your loyalty points right now.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Account settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Email</label>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Full name</label>
                    <p className="text-white">{user.full_name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Account status</label>
                    <Badge className={user.is_active ? "bg-green-600" : "bg-red-600"}>
                      {user.is_active ? "Verified" : "Not verified"}
                    </Badge>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="space-y-2">
                    <Link href="/profile/edit">
                      <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                        Edit profile
                      </Button>
                    </Link>
                    <Link href="/profile/change-password">
                      <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                        Change password
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

// --------- wrapper avec Suspense (obligatoire pour useSearchParams) ---------
export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}
