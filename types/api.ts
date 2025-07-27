export interface ProductImage {
  url: string
  alt_text?: string | null
  order?: number | null
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
  price: number
  in_stock: boolean
  images: ProductImage[]
}

export interface User {
  id: string
  email: string
  is_active: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}
