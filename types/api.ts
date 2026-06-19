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
  gender?: "men" | "women" | "unisex" | string | null
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
  user_email?: string | null
  is_guest?: boolean
  items: OrderItem[]
  shipping: ShippingInfo
  payment_method: "cod" | "stripe" | "paypal"
  total_amount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  payment_status: "unpaid" | "paid" | "refunded"
  created_at: string
  updated_at: string
  promo_code?: string | null;     // <-- optionnel si le back le renvoie
  pack_items?: any[];
  subtotal?: number | null;
  discount_value?: number | null;
  pack_discount_value?: number;
  loyalty_points_to_use?: number;
  loyalty_points_used?: number;
  loyalty_discount_value?: number;
  loyalty_points_earned?: number;
  loyalty_points_awarded?: boolean;
  shipping_amount?: number | null;
  shipping_rate_id?: string | null;
  shipping_rate_name?: string | null;
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
  author?: string | null   // <-- NEW
}

export interface ReviewStats {
  average_rating: number | null
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

export interface HeaderVideoAsset {
  file_id?: string | null
  name?: string | null
  url: string
  thumbnail_url?: string | null
  file_path?: string | null
  mime?: string | null
  size?: number | null
}

export interface HeaderVideo {
  title?: string | null
  subtitle?: string | null
  description?: string | null
  video: HeaderVideoAsset
  image?: HeaderVideoAsset | null
}

export interface DropCountdown {
  is_active?: boolean
  drop_name?: string
  title?: string
  subtitle?: string | null
  launch_at: string
  cta_label?: string
  cta_url?: string
  email_enabled?: boolean
  email_subject?: string
  email_preview?: string | null
  seconds_remaining: number
  is_released: boolean
  notification_sent_at?: string | null
  notification_recipients_count?: number
  subscribers_count?: number
}

export interface DropNotificationStatus {
  drop_key: string
  is_subscribed: boolean
  subscribers_count?: number
}

export type VlogChapterStatus = "draft" | "coming_soon" | "active" | "completed" | "archived"
export type VlogEpisodeStatus = "draft" | "coming_soon" | "released" | "hidden"

export interface VlogSettings {
  title?: string
  subtitle?: string | null
  description?: string
  hero_image_url?: string | null
  hero_video_url?: string | null
  is_active?: boolean
  updated_at?: string | null
}

export interface ProductSummary {
  id: string
  name: string
  full_name?: string | null
  price: number
  image_url?: string | null
  in_stock?: boolean
}

export interface PackProductSummary {
  id: string
  name: string
  full_name?: string | null
  price: number
  image_url?: string | null
  in_stock?: boolean
}

export interface PackComponent {
  id: string
  product_id: string
  color?: string | null
  size?: string | null
  qty?: number
  product: PackProductSummary
  locked_variant?: boolean
}

export interface Pack {
  id: string
  title: string
  description?: string | null
  product_ids?: string[] | null
  components?: PackComponent[]
  products?: PackProductSummary[]
  discount_type: "percent" | "fixed_amount"
  discount_value: number
  status: "draft" | "active" | "archived"
  image_url?: string | null
  order?: number
  starts_at?: string | null
  ends_at?: string | null
  original_price?: number
  pack_price?: number
  savings_value?: number
  created_at: string
  updated_at: string
}

export interface PackOrderComponent {
  component_id?: string | null
  product_id: string
  color: string
  size: string
  qty?: number
  unit_price: number
}

export interface PackOrderSelection {
  pack_id: string
  qty?: number
  items: PackOrderComponent[]
}

export interface ShortFilm {
  title?: string | null
  description?: string | null
  video_url?: string | null
  thumbnail_url?: string | null
  release_date?: string | null
  is_released?: boolean
}

export interface VlogEpisode {
  episode_number: number
  title: string
  description?: string | null
  video_url?: string | null
  thumbnail_url?: string | null
  release_date?: string | null
  status?: VlogEpisodeStatus
  linked_product_ids?: string[]
  order?: number
  id: string
  chapter_id: string
  products?: ProductSummary[]
  view_count?: number
  like_count?: number
  comment_count?: number
  liked_by_current_user?: boolean
  created_at: string
  updated_at: string
}

export interface VlogEpisodeView {
  episode_id: string
  view_count: number
}

export interface VlogEpisodeLike {
  episode_id: string
  liked: boolean
  like_count: number
}

export interface VlogComment {
  id: string
  episode_id: string
  user_id: string
  content: string
  status?: "visible" | "hidden"
  author?: string | null
  episode_title?: string | null
  created_at: string
  updated_at: string
}

export interface VlogCommentCreate {
  content: string
}

export interface VlogChapter {
  title: string
  slug: string
  description?: string | null
  cover_image_url?: string | null
  trailer_video_url?: string | null
  status?: VlogChapterStatus
  order?: number
  release_date?: string | null
  short_film?: ShortFilm | null
  id: string
  created_at: string
  updated_at: string
  episodes?: VlogEpisode[]
}

export interface VlogPage {
  settings: VlogSettings
  chapters?: VlogChapter[]
}

export interface CartItem {
  product: Product
  selectedVariant: Variant
  selectedSize: string
  quantity: number // This remains 'quantity' for the frontend cart state
}

export interface CartPackItem {
  pack: Pack
  selections: PackOrderComponent[]
  quantity: number
}

// Search filters
export interface SearchFilters {
  text?: string
  min_price?: number
  max_price?: number
  gender?: "men" | "women" | "unisex" | string
  color?: string
  size?: string
  sort?: string
}

// Auth types
export interface UserCreate {
  email: string
  full_name?: string | null
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
  payment_method?: "cod" | "stripe" | "paypal"
  user_id?: string | null
  promo_code?: string | null;
  loyalty_points_to_use?: number;
  pack_items?: PackOrderSelection[];
}

// apres WishlistCreate
export interface ContactMessage {
  full_name: string
  email:     string
  subject:   string
  message:   string
}

export type ApplyRequest = {
  code: string;
  user_id?: string | null;
  order_total: number;
  product_ids?: string[] | null;
  category_ids?: string[] | null;
};

export type ApplyResponse = {
  valid: boolean;
  reason?: string | null;
  discounted_total?: number | null;
  discount_value?: number | null;
  code?: string | null;
};

export interface ShippingQuoteRequest {
  country: string
  city: string
  order_total: number
}

export interface ShippingQuoteResponse {
  shipping_rate_id: string
  shipping_rate_name: string
  shipping_amount: number
  free_shipping_threshold?: number | null
}

export interface LoyaltySettings {
  is_active?: boolean
  earning_percentage?: number
  point_value?: number
  min_redeem_points?: number
  max_redeem_percentage?: number
  updated_at?: string | null
}

export interface LoyaltyTransaction {
  id: string
  user_id: string
  type: "earn" | "redeem" | "refund" | "adjust"
  points: number
  value: number
  order_id?: string | null
  reason?: string | null
  balance_after: number
  created_at: string
}

export interface LoyaltyBalance {
  user_id: string
  points_balance: number
  value_balance: number
  settings: LoyaltySettings
  recent_transactions?: LoyaltyTransaction[]
}

export interface LoyaltyQuoteRequest {
  order_total: number
  points_to_use?: number
}

export interface LoyaltyQuote {
  points_balance: number
  requested_points: number
  usable_points: number
  discount_value: number
  remaining_total: number
  estimated_points_earned: number
  settings: LoyaltySettings
}

export type StoreAnalyticsEventName =
  | "page_viewed"
  | "product_viewed"
  | "collection_viewed"
  | "search_submitted"
  | "notify_me_clicked"
  | "account_created"
  | "login"
  | "logout"
  | "add_to_cart"
  | "remove_from_cart"
  | "cart_viewed"
  | "checkout_started"
  | "shipping_info_submitted"
  | "payment_started"
  | "payment_success"
  | "payment_failed"
  | "order_completed"
  | "coupon_applied"
  | "size_selected"
  | "color_selected"
  | "wishlist_added"
  | "button_clicked"
  | "form_submitted"
  | "form_field_changed"
  | "cart_quantity_changed"
  | "cart_cleared"
  | "session_started"
  | "session_heartbeat"
  | "session_ended"
  | "page_hidden"
  | "page_visible"
  | "page_engagement"
  | "page_exited"
  | "user_activity"
  | "user_idle"
  | "form_field_focused"
  | "scroll_depth_reached"

export interface StoreAnalyticsEventPayload {
  event_name: StoreAnalyticsEventName | string
  anonymous_id?: string | null
  session_id?: string | null
  product_id?: string | null
  order_id?: string | null
  event_category?: string | null
  page_path?: string | null
  page_title?: string | null
  action_target?: string | null
  device_type?: string | null
  metadata?: Record<string, unknown>
  referrer?: string | null
  source?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  has_account?: boolean
}
