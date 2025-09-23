import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "@/contexts/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";

import "./globals.css";
import { StatsProvider } from "@/lib/stats-context";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeConnect",
  description: "Premium demand & supply platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <StatsProvider>
              <ConvexClientProvider>
                <ThemeProvider>
                  <Toaster position="bottom-right" />
                  {children}
                </ThemeProvider>
              </ConvexClientProvider>
            </StatsProvider>
          </AuthProvider>
        </Suspense>
        
      </body>
    </html>
  );
}
