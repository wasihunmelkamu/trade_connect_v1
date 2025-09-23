import Link from "next/link"
import { Search, Filter, Star, MapPin, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const products = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    price: "$4.99/kg",
    supplier: "Green Valley Farm",
    location: "California, USA",
    rating: 4.8,
    reviews: 124,
    image: "/fresh-organic-tomatoes.png",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 2,
    name: "Premium Coffee Beans",
    price: "$24.99/kg",
    supplier: "Mountain Coffee Co.",
    location: "Colombia",
    rating: 4.9,
    reviews: 89,
    image: "/premium-coffee-beans.jpg",
    category: "Beverages",
    inStock: true,
  },
  {
    id: 3,
    name: "Handcrafted Wooden Furniture",
    price: "$299.99",
    supplier: "Artisan Woodworks",
    location: "Oregon, USA",
    rating: 4.7,
    reviews: 56,
    image: "/handcrafted-wooden-furniture.png",
    category: "Furniture",
    inStock: true,
  },
  {
    id: 4,
    name: "Organic Honey",
    price: "$12.99/jar",
    supplier: "Bee Happy Farm",
    location: "New Zealand",
    rating: 4.9,
    reviews: 203,
    image: "/organic-honey-jar.jpg",
    category: "Food",
    inStock: false,
  },
  {
    id: 5,
    name: "Sustainable Textiles",
    price: "$18.99/m",
    supplier: "EcoFabric Ltd.",
    location: "India",
    rating: 4.6,
    reviews: 78,
    image: "/sustainable-eco-textiles.jpg",
    category: "Textiles",
    inStock: true,
  },
  {
    id: 6,
    name: "Fresh Seafood Selection",
    price: "$29.99/kg",
    supplier: "Ocean Fresh Co.",
    location: "Norway",
    rating: 4.8,
    reviews: 145,
    image: "/fresh-seafood-selection.jpg",
    category: "Seafood",
    inStock: true,
  },
]

const categories = ["All", "Vegetables", "Beverages", "Furniture", "Food", "Textiles", "Seafood"]

export default function MarketplacePage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="MarketConnect" className="h-8 w-8" />
                <span className="text-xl font-bold">MarketConnect</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link href="/marketplace" className="text-foreground font-medium">
                  Marketplace
                </Link>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Browse Products</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover quality products from trusted suppliers worldwide
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search products, suppliers, or categories..." className="pl-10" />
                </div>
                <Button>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === "All" ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      {!product.inStock && (
                        <Badge className="absolute top-2 left-2" variant="destructive">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">{product.price}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {product.location}
                    </div>
                    <p className="text-sm text-muted-foreground">by {product.supplier}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1 bg-transparent" disabled={!product.inStock}>
                        View Details
                      </Button>
                      <Button className="flex-1" disabled={!product.inStock}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted py-12">
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
                    <Link href="/categories" className="hover:text-foreground transition-colors">
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/search" className="hover:text-foreground transition-colors">
                      Search
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
    </ProtectedRoute>
  )
}
