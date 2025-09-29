import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Globe, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                  <Image src="/logo.png" alt="MarketConnect Logo" width={24} height={24} className="h-6 w-6" />
                </div>
                <span className="font-bold text-xl text-foreground">MarketConnect</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
             
              <Link href="/about" className="text-foreground font-medium">
                About
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Globe className="h-3 w-3 mr-1" />
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Connecting the World of
              <span className="text-primary"> Commerce</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              MarketConnect was founded with a simple mission: to bridge the gap between suppliers and consumers
              worldwide, creating opportunities for growth and prosperity.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To create the world's most trusted marketplace platform where suppliers and consumers can connect,
                trade, and grow their businesses with confidence and ease.
              </p>
              <p className="text-lg text-muted-foreground">
                We believe in democratizing commerce by providing equal opportunities for businesses of all sizes to
                participate in the global marketplace.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-border">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">10K+</CardTitle>
                  <CardDescription>Active Users</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl">50+</CardTitle>
                  <CardDescription>Countries</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at MarketConnect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Trust & Transparency</CardTitle>
                <CardDescription>
                  We build trust through transparent processes, verified profiles, and secure trading environments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Community First</CardTitle>
                <CardDescription>
                  Our community of suppliers and consumers is at the heart of everything we do.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Excellence</CardTitle>
                <CardDescription>
                  We strive for excellence in every aspect of our platform and customer experience.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Join Our Journey</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Be part of the future of commerce. Connect with thousands of suppliers and consumers worldwide.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                  <Image src="/logo.png" alt="MarketConnect Logo" width={24} height={24} className="h-6 w-6" />
                </div>
                <span className="font-bold text-xl text-foreground">MarketConnect</span>
              </div>
              <p className="text-muted-foreground">
                Connecting suppliers and consumers worldwide through our trusted marketplace platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                
                <li>
                  <Link href="/categories" className="hover:text-foreground transition-colors">
                    Categories
                  </Link>
                </li>
               
        
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                
               
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
               
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 MarketConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
