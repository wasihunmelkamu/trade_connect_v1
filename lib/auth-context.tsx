"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  type: "supplier" | "consumer"
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string, type: "supplier" | "consumer") => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("marketconnect_user")
    const tokenExpiry = localStorage.getItem("marketconnect_token_expiry")

    if (savedUser && tokenExpiry) {
      const expiryTime = Number.parseInt(tokenExpiry)
      const currentTime = Date.now()

      // Check if token is still valid (24 hours)
      if (currentTime < expiryTime) {
        setUser(JSON.parse(savedUser))
      } else {
        // Token expired, clear storage
        localStorage.removeItem("marketconnect_user")
        localStorage.removeItem("marketconnect_token_expiry")
      }
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app, this would be an API call
    if (email && password) {
      const mockUser: User = {
        id: "1",
        name: email.includes("supplier") ? "Green Valley Farm" : "John Consumer",
        email,
        type: email.includes("supplier") ? "supplier" : "consumer",
        isVerified: true,
      }
      setUser(mockUser)
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000
      localStorage.setItem("marketconnect_user", JSON.stringify(mockUser))
      localStorage.setItem("marketconnect_token_expiry", expiryTime.toString())
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }

  const signUp = async (
    email: string,
    password: string,
    name: string,
    type: "supplier" | "consumer",
  ): Promise<boolean> => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password && name) {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        type,
        isVerified: false,
      }
      setUser(newUser)
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000
      localStorage.setItem("marketconnect_user", JSON.stringify(newUser))
      localStorage.setItem("marketconnect_token_expiry", expiryTime.toString())
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("marketconnect_user")
    localStorage.removeItem("marketconnect_token_expiry")
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
