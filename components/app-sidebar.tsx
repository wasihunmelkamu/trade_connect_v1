// components/layout/app-sidebar.tsx
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/auth/user-menu"

import { Search, PlusCircle, UserLockIcon, BookMarkedIcon } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "./theme-toggle"
import { Authenticated, useAuthUser } from "@/contexts/AuthGuard"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const currentUser = useAuthUser()
  const pathname = usePathname()

  console.log({ currentUser })

  const isAdmin = currentUser?.role === "admin"

  // Define navigation items
  const navItems = [
    { name: "Posts", href: "/dashboard", icon: Search },
    ...(currentUser ?
      [
        { name: "Post Item", href: "/dashboard/posts/new", icon: PlusCircle },
        { name: "My Favorites", href: "/dashboard/favorites", icon: BookMarkedIcon }
      ] : []),
    ...(isAdmin
      ? [
        { name: "Admin", href: "/dashboard/admin", icon: UserLockIcon }
      ]
      : []),
  ]

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">TC</span>
          </div>
          <span className="text-xl font-bold">TradeConnect</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name} >
              <SidebarMenuButton asChild className={cn({ "bg-primary text-white hover:bg-primary/80 hover:text-white": item.href === pathname })}>
                <Link href={item.href} >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between">
          {/* <ThemeToggle /> */}
          {currentUser ? <UserMenu /> : <Button asChild><Link href="/auth/sign-in">Sign In</Link></Button>}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}