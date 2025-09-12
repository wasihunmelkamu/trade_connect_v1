import { SidebarProvider } from "@/components/ui/sidebar"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { LoadAuthUser } from "@/contexts/AuthGuard"

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <LoadAuthUser>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-1 flex-col">
                    <Header />
                    <main className="w-full p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </LoadAuthUser>
    )
}