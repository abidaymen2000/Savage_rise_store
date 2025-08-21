import type {
  Product,
  User,
  AuthTokens,
  Order,
  OrderItem,
  ShippingInfo,
  Review,
  ReviewStats,
  WishlistItem,
  Category,
  SearchFilters,
  UserCreate,
  UserUpdate,
  PasswordChange,
  PasswordResetRequest,
  PasswordReset,
  ReviewCreate,
  ReviewUpdate,
  WishlistCreate,
  OrderCreate,
  HealthStatus,
  ContactMessage,
  ApplyResponse,
} from "@/types/api"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://savage-rise-backend-d86a05fb19d4.herokuapp.com");

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Étendons RequestInit pour autoriser body:any
type FetchOptions = Omit<RequestInit, "body"> & {
  body?: any
}

async function fetchApi<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    console.log(`🔄 Fetching: ${url}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const fetchOptions: RequestInit = {
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      signal: controller.signal,
    }

    if (options?.body !== undefined) {
      // stringifie si c’est un objet
      if (typeof options.body === "object") {
        fetchOptions.body = JSON.stringify(options.body)
      } else {
        fetchOptions.body = options.body
      }
    }

    const response = await fetch(url, fetchOptions)
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ API Error ${response.status}:`, errorText)
      throw new ApiError(
        response.status,
        `HTTP error! status: ${response.status} - ${errorText}`
      )
    }

    if (response.status === 204) {
      return null as T
    }

    const data = await response.json()
    console.log(`✅ API Success: ${url}`)
    return data
  } catch (error: unknown) {
    console.error(`❌ API Error for ${url}:`, error)

    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(`Network error: Unable to connect to API server`)
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout: API server took too long to respond`)
    }

    const message = error instanceof Error ? error.message : "Unknown error"
    throw new Error(`Network error: ${message}`)
  }
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("savage_rise_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const api = {
  // Products
  async getProducts(skip = 0, limit = 10): Promise<Product[]> {
    return fetchApi<Product[]>(`/products/?skip=${skip}&limit=${limit}`)
  },

  async getProduct(productId: string): Promise<Product> {
    const products = await this.getProducts(0, 100)
    const product = products.find((p) => p.id === productId)
    if (!product) {
      throw new Error("Product not found")
    }
    return product
  },

  async searchProducts(filters: SearchFilters, skip = 0, limit = 10): Promise<Product[]> {
    const params = new URLSearchParams()
    if (filters.text) params.append("text", filters.text)
    if (filters.min_price) params.append("min_price", filters.min_price.toString())
    if (filters.max_price) params.append("max_price", filters.max_price.toString())
    if (filters.color) params.append("color", filters.color)
    if (filters.size) params.append("size", filters.size)
    if (filters.sort) params.append("sort", filters.sort)
    params.append("skip", skip.toString())
    params.append("limit", limit.toString())

    return fetchApi<Product[]>(`/products/search?${params.toString()}`)
  },

  // Auth
  async signup(email: string, password: string, full_name: string): Promise<User> {
    const userData: UserCreate = { email, password, full_name }
    return fetchApi<User>("/auth/signup", {
      method: "POST",
      body: userData,
    })
  },

  async login(email: string, password: string): Promise<AuthTokens> {
    const formData = new FormData()
    formData.append("username", email)
    formData.append("password", password)

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const text = await response.text()
      let detail = text || "Login failed"
      try {
        const j = JSON.parse(text)
        if (typeof j?.detail === "string") detail = j.detail
      } catch { }
      throw new ApiError(response.status, detail)
    }

    return await response.json()
  },

  async verifyEmail(token: string): Promise<void> {
    await fetchApi(`/auth/verify-email?token=${encodeURIComponent(token)}`)
  },

  async forgotPassword(email: string): Promise<void> {
    const data: PasswordResetRequest = { email }
    await fetchApi("/auth/forgot-password", {
      method: "POST",
      body: data,
    })
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const data: PasswordReset = { token, new_password: newPassword }
    await fetchApi("/auth/reset-password", {
      method: "POST",
      body: data,
    })
  },

  async resendVerification(email: string): Promise<void> {
    const data: PasswordResetRequest = { email }
    await fetchApi("/auth/resend-verification", {
      method: "POST",
      body: data,
    })
  },
  // Profile
  async getProfile(): Promise<User> {
    return fetchApi<User>("/profile/me", {
      headers: getAuthHeaders(),
    })
  },

  async updateProfile(data: UserUpdate): Promise<User> {
    return fetchApi<User>("/profile/me", {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: data,
    })
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const data: PasswordChange = {
      current_password: currentPassword,
      new_password: newPassword,
    }
    await fetchApi("/profile/change-password", {
      method: "POST",
      headers: getAuthHeaders(),
      body: data,
    })
  },

  // Orders
  async createOrder(
    items: OrderItem[],
    shipping: ShippingInfo,
    promoCode?: string
  ): Promise<Order> {
    const orderData: OrderCreate = {
      items,
      shipping,
      payment_method: "cod",
      ...(promoCode ? { promo_code: promoCode } : {}),
    }
    return fetchApi<Order>("/orders/", {
      method: "POST",
      headers: getAuthHeaders(),
      body: orderData,
    })
  },

  async getMyOrders(): Promise<Order[]> {
    return fetchApi<Order[]>("/profile/orders", {
      headers: getAuthHeaders(),
    })
  },

  async getOrder(orderId: string): Promise<Order> {
    return fetchApi<Order>(`/orders/${orderId}`)
  },

  async getMyOrder(orderId: string): Promise<Order> {
    return fetchApi<Order>(`/profile/orders/${orderId}`, {
      headers: getAuthHeaders(),
    })
  },

  async cancelOrder(orderId: string): Promise<Order> {
    return fetchApi<Order>(`/orders/${orderId}/cancel`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    })
  },

  // Reviews
  async getProductReviews(
    productId: string,
    rating?: number,
    sortBest = false,
    skip = 0,
    limit = 10,
  ): Promise<Review[]> {
    const params = new URLSearchParams()
    if (rating) params.append("rating", rating.toString())
    params.append("sort_best", sortBest.toString())
    params.append("skip", skip.toString())
    params.append("limit", limit.toString())

    return fetchApi<Review[]>(`/products/${productId}/reviews/?${params.toString()}`)
  },

  async getReviewStats(productId: string): Promise<ReviewStats> {
    return fetchApi<ReviewStats>(`/products/${productId}/reviews/stats`)
  },

  async addReview(productId: string, rating: number, comment: string, title?: string): Promise<Review> {
    const reviewData: ReviewCreate = {
      rating,
      comment,
      title,
      user_id: "current_user",
    }
    return fetchApi<Review>(`/products/${productId}/reviews/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: reviewData,
    })
  },

  async updateReview(productId: string, reviewId: string, data: ReviewUpdate): Promise<Review> {
    return fetchApi<Review>(`/products/${productId}/reviews/${reviewId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: data,
    })
  },

  async deleteReview(productId: string, reviewId: string): Promise<void> {
    await fetchApi(`/products/${productId}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
  },

  // Wishlist
  async getWishlist(skip = 0, limit = 20): Promise<WishlistItem[]> {
    return fetchApi<WishlistItem[]>(`/profile/wishlist/?skip=${skip}&limit=${limit}`, {
      headers: getAuthHeaders(),
    })
  },

  async addToWishlist(productId: string): Promise<WishlistItem> {
    const data: WishlistCreate = { product_id: productId }
    return fetchApi<WishlistItem>("/profile/wishlist/", {
      method: "POST",
      headers: getAuthHeaders(),
      body: data,
    })
  },

  async removeFromWishlist(productId: string): Promise<void> {
    await fetchApi(`/profile/wishlist/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return fetchApi<Category[]>("/categories/")
  },

  async getCategory(categoryId: string): Promise<Category> {
    return fetchApi<Category>(`/categories/${categoryId}`)
  },

  async getProductsByCategory(categoryName: string, skip = 0, limit = 10): Promise<Product[]> {
    return fetchApi<Product[]>(`/categories/${categoryName}/products?skip=${skip}&limit=${limit}`)
  },

  async sendContact(data: ContactMessage): Promise<void> {
    await fetchApi<void>("/contact", {
      method: "POST",
      body: data,
    })
  },

  // Reviews (profil)
  async getMyReviews(skip = 0, limit = 20) {
    return fetchApi<Review[]>(`/profile/reviews?skip=${skip}&limit=${limit}`, {
      headers: getAuthHeaders(),
    })
  },

  // Health-check
  async checkHealth(): Promise<HealthStatus> {
    return fetchApi<HealthStatus>(`/health`)
  },

  // Promo codes
  async applyPromo(code: string, items: OrderItem[]): Promise<ApplyResponse> {
    const order_total = items.reduce((s, it) => s + it.qty * it.unit_price, 0)
    const product_ids = items.map((it) => it.product_id)

    return fetchApi<ApplyResponse>("/promocodes/apply", {
      method: "POST",
      headers: getAuthHeaders(),                // ⬅️ IMPORTANT
      body: {
        code: code.trim().toUpperCase(),
        order_total,
        product_ids,
        category_ids: [],
        // user_id: inutile → le back utilise l'utilisateur authentifié
      },
    })
  }
}
