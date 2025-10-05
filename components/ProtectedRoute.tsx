"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredUserType?: "supplier" | "consumer"
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredUserType,
  redirectTo = "/auth/sign-in",
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        router.push(redirectTo)
      
      }
    }
  }, [user, isLoading, requireAuth, requiredUserType, router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground"></p>
        </div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null
  }

  if (requiredUserType && user && user.type !== requiredUserType) {
    return null
  }

  return <>{children}</>
}
