"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { api } from "@/lib/api"
import type { User } from "@/types/api"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  resendVerification: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const token = localStorage.getItem("savage_rise_token")
    if (token) {
      refreshUser()
    } else {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const refreshUser = async () => {
    try {
      const user = await api.getProfile()
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      console.error("Failed to refresh user:", error)
      localStorage.removeItem("savage_rise_token")
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const tokens = await api.login(email, password)
      localStorage.setItem("savage_rise_token", tokens.access_token)
      await refreshUser()
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      await api.signup(email, password, fullName)
      // L'utilisateur doit vérifier son email avant de pouvoir se connecter
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("savage_rise_token")
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  // ✅ Utiliser la méthode dédiée de ton api
  const resendVerification = async (email: string) => {
    try {
      await api.resendVerification(email)
    } catch (error) {
      console.error("Resend verification failed:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        refreshUser,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
