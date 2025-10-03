"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { User, LogOut } from "lucide-react"

export function AuthNav() {
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/auth/sign-in">Sign In</Link>
        </Button>
        
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 text-sm">
        <User className="h-4 w-4" />
        <span>{user.name}</span>
        <Badge variant="outline" className="text-xs">
          {user.type}
        </Badge>
      </div>
      <Button variant="ghost" onClick={signOut} size="sm">
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  )
}
