"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Users,
  Package,
  MessageSquare,
  Star,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StatsSection } from "@/components/StatsSection";
import { AuthNav } from "@/components/auth-nav";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="MarketConnect Logo"
                    width={24}
                    height={24}
                    className="h-12 w-16"
                  />
                </div>
                <span className="font-bold text-xl text-foreground">
                  MarketConnect
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>

            <AuthNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Zap className="h-3 w-3 mr-1" />
              Connect. Trade. Grow.
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Where Suppliers Meet
              <span className="text-primary">Consumers</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Join the most trusted marketplace platform connecting suppliers
              with consumers. Post products, discover demands, and build lasting
              business relationships.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {!isLoading && (
                <>
                  {user ? (
                    // Authenticated user buttons
                    <>
                      {user.type === "supplier" ? (
                        <Link href="/sell">
                          <Button size="lg" className="text-lg px-8">
                            Go to Dashboard
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/auth/sign-in?redirect=/sell">
                          <Button size="lg" className="text-lg px-8">
                            Start Selling
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                      )}
                      <Link href="/marketplace">
                        <Button
                          variant="outline"
                          size="lg"
                          className="text-lg px-8 bg-transparent"
                        >
                          Browse Products
                        </Button>
                      </Link>
                    </>
                  ) : (
                    // Non-authenticated user buttons
                    <>
                      <Link href="/auth/sign-up">
                        <Button size="lg" className="text-lg px-8">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Trade
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools suppliers and consumers need
              to connect and grow their business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Post Products</CardTitle>
                <CardDescription>
                  Suppliers can easily list their products with detailed
                  descriptions, images, and pricing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Post Demands</CardTitle>
                <CardDescription>
                  Consumers can post their requirements and receive tailored
                  offers from suppliers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary"/>
                </div>
                <CardTitle>Real-time Chat</CardTitle>
                <CardDescription>
                  Communicate directly with trading partners through our
                  integrated messaging system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Ratings & Reviews</CardTitle>
                <CardDescription>
                  Build trust with transparent ratings and reviews from verified
                  trading partners.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure Trading</CardTitle>
                <CardDescription>
                  Trade with confidence using our secure platform with verified
                  user profiles.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12  w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Track your performance with detailed analytics and insights on
                  your listings.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="MarketConnect Logo"
                    width={24}
                    height={24}
                    className="h-12 w-16"
                  />
                </div>
                <span className="font-bold text-xl text-foreground">
                  MarketConnect
                </span>
              </div>
              <p className="text-muted-foreground">
                Connecting suppliers and consumers worldwide through our trusted
                marketplace platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-foreground transition-colors"
                  >
                    Categories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left text-muted-foreground">
                <p>&copy; 2025 MarketConnect. All rights reserved.</p>
                <p className="text-sm mt-1">
                  Secure trading platform with SSL encryption
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-green-600" />
                  SSL Secured
                </span>
                <Link
                  href="/compliance"
                  className="hover:text-foreground transition-colors"
                >
                  Compliance
                </Link>
                <Link
                  href="/accessibility"
                  className="hover:text-foreground transition-colors"
                >
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
