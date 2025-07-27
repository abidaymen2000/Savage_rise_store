import type { Product, User } from "@/types/api"

const API_BASE_URL = "http://localhost:8000"

// Mock data for fallback
const mockProducts: Product[] = [
  {
    id: "1",
    style_id: "SR-001",
    name: "Costume Milano",
    full_name: "Costume Milano - Collection Signature",
    sku: "SR-MILANO-001",
    description:
      "Un costume d'exception taillé dans les plus beaux tissus italiens. Coupe moderne et élégante pour l'homme d'affaires contemporain.",
    price: 1299,
    in_stock: true,
    fabric: "Laine Super 120s",
    composition: { Laine: 95, Élasthanne: 5 },
    care_instructions: "Nettoyage à sec uniquement",
    zip_color_options: ["Noir", "Blanc"],
    images: [
      {
        url: "/placeholder.svg?height=400&width=300&text=Costume+Milano+Noir",
        alt_text: "Costume Milano Noir",
        order: 1,
      },
      {
        url: "/placeholder.svg?height=400&width=300&text=Costume+Milano+Blanc",
        alt_text: "Costume Milano Blanc",
        order: 2,
      },
    ],
  },
  {
    id: "2",
    style_id: "SR-002",
    name: "Chemise Oxford",
    full_name: "Chemise Oxford - Collection Premium",
    sku: "SR-OXFORD-002",
    description:
      "Chemise Oxford premium en coton égyptien. Finitions impeccables et coupe ajustée pour un style raffiné.",
    price: 189,
    in_stock: true,
    fabric: "Coton égyptien",
    composition: { Coton: 100 },
    care_instructions: "Lavage machine 30°C",
    zip_color_options: ["Noir", "Blanc"],
    images: [
      {
        url: "/placeholder.svg?height=400&width=300&text=Chemise+Oxford+Noir",
        alt_text: "Chemise Oxford Noir",
        order: 1,
      },
      {
        url: "/placeholder.svg?height=400&width=300&text=Chemise+Oxford+Blanc",
        alt_text: "Chemise Oxford Blanc",
        order: 2,
      },
    ],
  },
  {
    id: "3",
    style_id: "SR-003",
    name: "Montre Heritage",
    full_name: "Montre Heritage - Collection Horlogerie",
    sku: "SR-WATCH-003",
    description:
      "Montre automatique suisse avec boîtier en acier inoxydable et bracelet en cuir italien. Mouvement mécanique de précision.",
    price: 2499,
    in_stock: true,
    fabric: "Acier inoxydable",
    composition: { Acier: 80, Cuir: 20 },
    care_instructions: "Éviter le contact avec l'eau",
    zip_color_options: ["Noir", "Blanc"],
    images: [
      {
        url: "/placeholder.svg?height=400&width=300&text=Montre+Heritage+Noir",
        alt_text: "Montre Heritage Noir",
        order: 1,
      },
      {
        url: "/placeholder.svg?height=400&width=300&text=Montre+Heritage+Blanc",
        alt_text: "Montre Heritage Blanc",
        order: 2,
      },
    ],
  },
  {
    id: "4",
    style_id: "SR-004",
    name: "Chaussures Oxford",
    full_name: "Chaussures Oxford - Collection Cuir",
    sku: "SR-SHOES-004",
    description:
      "Chaussures Oxford en cuir de veau italien. Semelle en cuir et finitions artisanales pour un confort exceptionnel.",
    price: 599,
    in_stock: true,
    fabric: "Cuir de veau italien",
    composition: { Cuir: 100 },
    care_instructions: "Cirage régulier recommandé",
    zip_color_options: ["Noir", "Blanc"],
    images: [
      {
        url: "/placeholder.svg?height=400&width=300&text=Oxford+Shoes+Noir",
        alt_text: "Chaussures Oxford Noir",
        order: 1,
      },
      {
        url: "/placeholder.svg?height=400&width=300&text=Oxford+Shoes+Blanc",
        alt_text: "Chaussures Oxford Blanc",
        order: 2,
      },
    ],
  },
]

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    console.log(`Fetching: ${url}`)
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Error for ${url}:`, error)
    if (error instanceof ApiError) {
      throw error
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export const api = {
  // Products
  async getProducts(skip = 0, limit = 10): Promise<Product[]> {
    try {
      return await fetchApi<Product[]>(`/products/?skip=${skip}&limit=${limit}`)
    } catch (error) {
      console.warn("API unavailable, using mock data:", error)
      // Return mock data as fallback
      return mockProducts.slice(skip, skip + limit)
    }
  },

  async getProduct(productId: string): Promise<Product> {
    try {
      return await fetchApi<Product>(`/products/${productId}`)
    } catch (error) {
      console.warn("API unavailable, using mock data:", error)
      // Return mock data as fallback
      const product = mockProducts.find((p) => p.id === productId)
      if (!product) {
        throw new Error("Product not found")
      }
      return product
    }
  },

  // Users
  async createUser(email: string, password: string): Promise<User> {
    try {
      return await fetchApi<User>("/users/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
    } catch (error) {
      console.warn("API unavailable for user creation:", error)
      throw error
    }
  },

  async getUser(userId: string): Promise<User> {
    try {
      return await fetchApi<User>(`/users/${userId}`)
    } catch (error) {
      console.warn("API unavailable for user fetch:", error)
      throw error
    }
  },

  // Image upload
  async uploadImage(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/upload-image`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new ApiError(response.status, `Upload failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.warn("API unavailable for image upload:", error)
      throw error
    }
  },
}

// Export mock data for development
export { mockProducts }
