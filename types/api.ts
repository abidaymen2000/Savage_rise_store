// Base types
export interface ProductImage {
  id: string
  url: string
  alt_text?: string | null
  order?: number | null
}

export interface SizeStock {
  size: string
  stock_on_hand?: number
  stock_reserved?: number
  stock_available?: number
  stock?: number
  meta_content_id?: string | null
}

export interface Variant {
  color: string
  sizes: SizeStock[]
  images: ProductImage[]
  meta_content_id?: string | null
}

export interface Product {
  id: string
  meta_item_group_id?: string | null
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

export interface OrderItemCreate {
  product_id: string
  color: string
  size: string
  qty: number
  variant_id?: string | null
}

export type OrderItem = OrderItemCreate

export interface PackOrderComponentCreate {
  component_id?: string | null
  product_id: string
  color: string
  size: string
  qty: number
  variant_id?: string | null
}

export interface PackOrderSelection {
  pack_id: string
  qty: number
  items: PackOrderComponentCreate[]
}

export type OrderShippingCreate = ShippingInfo

export interface MetaEventContext {
  event_source_url?: string | null
  fbp?: string | null
  fbc?: string | null
  fbclid?: string | null
  consent?: string | null
}

export interface PromotionQuoteOut {
  code?: string | null
  discount_value?: number | null
  discounted_total?: number | null
}

export interface LoyaltyQuoteSummaryOut {
  points_balance?: number
  requested_points?: number
  usable_points?: number
  discount_value?: number
  remaining_total?: number
  estimated_points_earned?: number
}

export interface InventoryAllocationOut {
  product_id?: string
  color?: string | null
  size?: string | null
  qty?: number
  pack_id?: string | null
  pack_component_id?: string | null
  item_type?: "single" | "pack_component" | string
  stock_available?: number | null
}

export interface OrderQuoteLineOut {
  item_type?: "single" | "pack_component" | string
  product_id: string
  variant_id?: string | null
  sku?: string | null
  meta_content_id?: string | null
  product_name?: string | null
  color: string
  size: string
  qty: number
  unit_price_original?: number | null
  unit_price?: number | null
  unit_price_final?: number | null
  discount_amount?: number | null
  line_total?: number | null
  pack_id?: string | null
  pack_title?: string | null
  pack_component_id?: string | null
  stock_available?: number | null
}

export interface OrderPackQuoteOut {
  pack_id?: string | null
  pack_title?: string | null
  qty?: number
  total_price?: number | null
  items?: OrderQuoteLineOut[]
}

export interface OrderQuoteOut {
  currency?: string
  subtotal: number
  pack_discount: number
  promotion_discount: number
  loyalty_discount: number
  shipping_amount: number
  total: number
  items?: OrderQuoteLineOut[]
  promotion?: PromotionQuoteOut | null
  loyalty?: LoyaltyQuoteSummaryOut | null
  warnings?: string[]
  shipping_rate_id?: string | null
  shipping_rate_name?: string | null
  pack_items?: OrderPackQuoteOut[]
  inventory_allocations?: InventoryAllocationOut[]
  discount_value?: number
  pack_discount_value?: number
  promo_code?: string | null
  promo_discount_value?: number
  loyalty_points_used?: number
  loyalty_discount_value?: number
  total_amount: number
  item_snapshots?: OrderQuoteLineOut[]
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "return_in_transit"
  | "return_received"
  | "returned"

export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded"

export type FulfillmentStatus =
  | "unfulfilled"
  | "reserved"
  | "processing"
  | "fulfilled"
  | "returning"
  | "returned"
  | "cancelled"

export interface Order {
  id: string
  user_id?: string | null
  user_email?: string | null
  is_guest?: boolean
  items: OrderItemCreate[]
  shipping: ShippingInfo
  payment_method: "cod" | "stripe" | "paypal"
  total_amount: number
  status: OrderStatus
  order_status?: OrderStatus
  payment_status: PaymentStatus
  fulfillment_status: FulfillmentStatus
  created_at: string
  updated_at: string
  idempotency_key?: string | null
  promo_code?: string | null
  pack_items?: OrderPackQuoteOut[]
  subtotal?: number | null
  discount_value?: number | null
  pack_discount_value?: number
  loyalty_points_to_use?: number
  loyalty_points_used?: number
  loyalty_discount_value?: number
  loyalty_eligible_amount?: number
  loyalty_points_earned?: number
  loyalty_points_awarded?: boolean
  shipping_amount?: number | null
  shipping_rate_id?: string | null
  shipping_rate_name?: string | null
  item_snapshots?: OrderQuoteLineOut[] | null
  inventory_allocations?: InventoryAllocationOut[] | null
  paid_at?: string | null
  cancelled_at?: string | null
  cancelled_by?: string | null
  cancellation_reason?: string | null
  refunded_amount?: number
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

export interface PackOrderComponent extends PackOrderComponentCreate {
  unit_price: number
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
export interface OrderCreatePayload {
  items: OrderItem[]          // liste des produits/quantités
  shipping: ShippingInfo      // infos de livraison
  payment_method?: "cod" | "stripe" | "paypal"
  user_id?: string | null
  promo_code?: string | null;
  loyalty_points_to_use?: number;
  pack_items?: PackOrderSelection[];
  meta?: MetaEventContext | null
}

export interface BackendConflictBody {
  detail?: string | { code?: string | null; message?: string | null; item?: string | null; [key: string]: unknown } | Array<Record<string, unknown>>
  code?: string | null
  message?: string | null
  item?: string | null
  order_id?: string | null
  [key: string]: unknown
}

export interface OrderActionReasonIn {
  reason?: string | null
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
