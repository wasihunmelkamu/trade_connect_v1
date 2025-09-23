import Link from "next/link"
import { ArrowLeft, Building, MapPin, Phone, Mail, Globe, Upload, Shield, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const benefits = [
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access customers worldwide and expand your market presence",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Protected transactions with guaranteed payment processing",
  },
  {
    icon: Star,
    title: "Build Reputation",
    description: "Earn reviews and build trust with verified customer feedback",
  },
  {
    icon: Building,
    title: "Business Tools",
    description: "Advanced analytics, inventory management, and marketing tools",
  },
]

const categories = [
  "Agriculture & Food",
  "Textiles & Clothing",
  "Electronics & Technology",
  "Home & Garden",
  "Health & Beauty",
  "Automotive",
  "Industrial Equipment",
  "Arts & Crafts",
  "Sports & Recreation",
  "Other",
]

export default function JoinSupplierPage() {
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
                <Link href="/join/consumer">Join as Consumer</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Join as a Supplier</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Start selling your products to customers worldwide and grow your business with MarketConnect
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
                  <CardTitle>Supplier Registration</CardTitle>
                  <p className="text-muted-foreground">Fill out the form below to start your journey as a supplier</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Business Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Business Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input id="businessName" placeholder="Your Business Name" />
                      </div>
                      <div>
                        <Label htmlFor="businessType">Business Type *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manufacturer">Manufacturer</SelectItem>
                            <SelectItem value="wholesaler">Wholesaler</SelectItem>
                            <SelectItem value="distributor">Distributor</SelectItem>
                            <SelectItem value="retailer">Retailer</SelectItem>
                            <SelectItem value="service">Service Provider</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="registrationNumber">Business Registration Number</Label>
                        <Input id="registrationNumber" placeholder="Registration number (optional)" />
                      </div>
                      <div>
                        <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                        <Input id="taxId" placeholder="Tax identification number" />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactName">Contact Person *</Label>
                        <Input id="contactName" placeholder="Full name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="business@example.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" placeholder="https://yourwebsite.com" />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Business Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input id="address" placeholder="123 Business Street" />
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

                  {/* Product Categories */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
                    <Label htmlFor="categories">What products do you sell? *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, "-")}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-4">
                      <Label htmlFor="description">Business Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your business, products, and what makes you unique..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Business Documents
                    </h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload business license or registration documents
                        </p>
                        <Button variant="outline" size="sm">
                          Choose Files
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Accepted formats: PDF, JPG, PNG. Max size: 10MB per file.
                      </p>
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
                      <Checkbox id="marketing" />
                      <Label htmlFor="marketing" className="text-sm">
                        I would like to receive marketing communications and updates
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button className="w-full" size="lg">
                    Submit Application
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Process */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Submit Application</h4>
                      <p className="text-sm text-muted-foreground">Complete the registration form</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Verification</h4>
                      <p className="text-sm text-muted-foreground">We'll verify your business details</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Approval</h4>
                      <p className="text-sm text-muted-foreground">Get approved and start selling</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our team is here to help you get started. Contact us if you have any questions.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Us
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Success Stories */}
              <Card>
                <CardHeader>
                  <CardTitle>Success Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-sm italic mb-2">
                        "MarketConnect helped us reach customers in 15 countries within our first year."
                      </p>
                      <p className="text-xs text-muted-foreground">- Green Valley Farm</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-sm italic mb-2">
                        "The platform's tools made managing our inventory and orders so much easier."
                      </p>
                      <p className="text-xs text-muted-foreground">- Artisan Woodworks</p>
                    </div>
                  </div>
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
