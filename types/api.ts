// Base types
export interface ProductImage {
  id: string
  url: string
  alt_text?: string | null
  order?: number | null
}

export interface SizeStock {
  size: string
  stock: number
}

export interface Variant {
  color: string
  sizes: SizeStock[]
  images: ProductImage[]
}

export interface Product {
  id: string
  style_id: string
  name: string
  full_name: string
  sku?: string | null
  description?: string | null
  packaging?: string | null
  style?: string | null
  season?: string | null
  target_audience?: string | null
  inspiration?: string | null
  fabric?: string | null
  composition?: Record<string, number> | null
  grammage?: string | null
  collar_type?: string | null
  zip_type?: string | null
  zip_length_cm?: number | null
  zip_color_options?: string[] | null
  sleeve_finish?: string | null
  hem_finish?: string | null
  logo_placement?: string | null
  label_detail?: string | null
  embroidery_position?: string | null
  embroidery_text?: string | null
  embroidery_size_cm?: string | null
  embroidery_color?: string | null
  alternative_marking?: string | null
  care_instructions?: string | null
  categories: string[]
  price: number
  in_stock: boolean
  variants: Variant[]
}

export interface User {
  id: string
  email: string
  is_active: boolean
  full_name?: string | null
}

export interface AuthTokens {
  access_token: string
  token_type: string
}

export interface ShippingInfo {
  full_name: string
  email: string
  phone: string
  address_line1: string
  address_line2?: string | null
  postal_code: string
  city: string
  country: string
}

export interface OrderItem {
  product_id: string
  color: string
  size: string
  qty: number // Changed back to 'qty' as per OpenAPI spec
  unit_price: number
}

export interface Order {
  id: string
  user_id?: string | null
  items: OrderItem[]
  shipping: ShippingInfo
  payment_method: "cod" | "stripe" | "paypal"
  total_amount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  payment_status: "unpaid" | "paid" | "refunded"
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  user_id: string
  product_id: string 
  rating: number
  title?: string | null
  comment?: string | null
  created_at: string
  updated_at: string
}

export interface ReviewStats {
  average_rating?: number | null
  count: number
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  added_at: string
}

export interface Category {
  id: string
  name: string
  description?: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  selectedVariant: Variant
  selectedSize: string
  quantity: number // This remains 'quantity' for the frontend cart state
}

// Search filters
export interface SearchFilters {
  text?: string
  min_price?: number
  max_price?: number
  color?: string
  size?: string
  sort?: string
}

// Auth types
export interface UserCreate {
  email: string
  password: string
}

export interface UserUpdate {
  email?: string | null
  full_name?: string | null
}

export interface PasswordChange {
  current_password: string
  new_password: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  token: string
  new_password: string
}

export interface ReviewCreate {
  rating: number
  title?: string | null
  comment?: string | null
  user_id: string
}

export interface ReviewUpdate {
  rating?: number | null
  title?: string | null
  comment?: string | null
}

export interface WishlistCreate {
  product_id: string
}

export interface HealthStatus {
  status: "online" | "offline"
}
export interface OrderCreate {
  items: OrderItem[]          // liste des produits/quantités
  shipping: ShippingInfo      // infos de livraison
  payment_method: "cod" | "stripe" | "paypal"
}

// apres WishlistCreate
export interface ContactMessage {
  full_name: string
  email:     string
  subject:   string
  message:   string
}