import Link from "next/link"
import { ArrowLeft, Shield, Heart, Truck, Star, Globe, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

const benefits = [
  {
    icon: Search,
    title: "Discover Quality Products",
    description: "Browse thousands of products from verified suppliers worldwide",
  },
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "Protected purchases with buyer protection and secure payments",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable shipping options from trusted logistics partners",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description: "Make informed decisions with authentic reviews from real customers",
  },
]

const interests = [
  "Agriculture & Food",
  "Fashion & Clothing",
  "Electronics & Gadgets",
  "Home & Garden",
  "Health & Beauty",
  "Sports & Fitness",
  "Books & Education",
  "Arts & Crafts",
  "Automotive",
  "Business Supplies",
]

const featuredSuppliers = [
  {
    name: "Green Valley Farm",
    category: "Organic Foods",
    rating: 4.9,
    products: 156,
    image: "/placeholder.svg?key=supplier1",
  },
  {
    name: "TechCraft Solutions",
    category: "Electronics",
    rating: 4.8,
    products: 89,
    image: "/placeholder.svg?key=supplier2",
  },
  {
    name: "Artisan Woodworks",
    category: "Furniture",
    rating: 4.7,
    products: 67,
    image: "/placeholder.svg?key=supplier3",
  },
]

export default function JoinConsumerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="MarketConnect" className="h-8 w-8" />
              <span className="text-xl font-bold">MarketConnect</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/join/supplier">Join as Supplier</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Join as a Consumer</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover amazing products from trusted suppliers around the world
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <benefit.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Registration Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Account</CardTitle>
                  <p className="text-muted-foreground">
                    Join thousands of satisfied customers shopping on MarketConnect
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Smith" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="john.smith@example.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input id="dateOfBirth" type="date" />
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Account Security
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input id="password" type="password" placeholder="Create a strong password" />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Password must be at least 8 characters with uppercase, lowercase, and numbers
                    </p>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Default Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input id="address" placeholder="123 Main Street" />
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" placeholder="City" />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Province *</Label>
                        <Input id="state" placeholder="State or Province" />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                        <Input id="zipCode" placeholder="12345" />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                            <SelectItem value="fr">France</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Shopping Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Shopping Preferences
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="interests">What are you interested in buying?</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {interests.map((interest) => (
                            <div key={interest} className="flex items-center space-x-2">
                              <Checkbox id={interest.toLowerCase().replace(/\s+/g, "-")} />
                              <Label htmlFor={interest.toLowerCase().replace(/\s+/g, "-")} className="text-sm">
                                {interest}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="budget">Monthly Shopping Budget</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-100">Under $100</SelectItem>
                            <SelectItem value="100-500">$100 - $500</SelectItem>
                            <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                            <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                            <SelectItem value="over-5000">Over $5,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Communication Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Communication Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="orderUpdates" defaultChecked />
                        <Label htmlFor="orderUpdates" className="text-sm">
                          Send me order updates and shipping notifications
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="promotions" />
                        <Label htmlFor="promotions" className="text-sm">
                          Send me promotional offers and deals
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="newsletter" />
                        <Label htmlFor="newsletter" className="text-sm">
                          Subscribe to our newsletter for product updates
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="age" />
                      <Label htmlFor="age" className="text-sm">
                        I confirm that I am at least 18 years old
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button className="w-full" size="lg">
                    Create Account
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/signin" className="text-primary hover:underline">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Why Join */}
              <Card>
                <CardHeader>
                  <CardTitle>Why Join MarketConnect?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Global Marketplace</h4>
                      <p className="text-sm text-muted-foreground">Access to suppliers from around the world</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Buyer Protection</h4>
                      <p className="text-sm text-muted-foreground">Your purchases are protected with our guarantee</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium">Quality Assurance</h4>
                      <p className="text-sm text-muted-foreground">All suppliers are verified and rated by customers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Suppliers */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Suppliers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {featuredSuppliers.map((supplier, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <img
                        src={supplier.image || "/placeholder.svg"}
                        alt={supplier.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{supplier.name}</h4>
                        <p className="text-xs text-muted-foreground">{supplier.category}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs ml-1">{supplier.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{supplier.products} products</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Suppliers
                  </Button>
                </CardContent>
              </Card>

              {/* Special Offer */}
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle>Welcome Offer!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Get 10% off your first order when you sign up today!</p>
                  <Badge variant="secondary" className="bg-primary-foreground text-primary">
                    Use code: WELCOME10
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="MarketConnect" className="h-8 w-8" />
                <span className="text-xl font-bold">MarketConnect</span>
              </div>
              <p className="text-muted-foreground">
                Connecting suppliers and consumers worldwide for sustainable trade.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/marketplace" className="hover:text-foreground transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/join/supplier" className="hover:text-foreground transition-colors">
                    Join as Supplier
                  </Link>
                </li>
                <li>
                  <Link href="/join/consumer" className="hover:text-foreground transition-colors">
                    Join as Consumer
                  </Link>
                </li>
                <li>
                  <Link href="/mobile" className="hover:text-foreground transition-colors">
                    Mobile App
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
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
                <li>
                  <Link href="/safety" className="hover:text-foreground transition-colors">
                    Safety
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="hover:text-foreground transition-colors">
                    Guidelines
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
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
                <li>
                  <Link href="/press" className="hover:text-foreground transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 MarketConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
