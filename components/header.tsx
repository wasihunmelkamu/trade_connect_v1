// components/layout/header.tsx
"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

import { UserMenu } from "@/components/auth/user-menu"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "./theme-toggle"
import { useAuthUser } from "@/contexts/AuthGuard"

export function Header() {
  const currentUser = useAuthUser()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-6" />
          <span className="font-medium">TradeConnect</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* <ThemeToggle /> */}
          {currentUser ? <UserMenu /> : <Button asChild><Link href="/auth/sign-in">Sign In</Link></Button>}
        </div>
      </div>
    </header>
  )
}