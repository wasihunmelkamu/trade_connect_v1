import Link from "next/link"
import { Plus, Package, TrendingUp, Users, DollarSign, Eye, Edit, Trash2, BarChart3, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const sellerProducts = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    price: "$4.99/kg",
    stock: 150,
    sold: 89,
    views: 1240,
    status: "active",
    image: "/fresh-organic-tomatoes.png",
  },
  {
    id: 2,
    name: "Premium Coffee Beans",
    price: "$24.99/kg",
    stock: 45,
    sold: 23,
    views: 567,
    status: "active",
    image: "/premium-coffee-beans.jpg",
  },
  {
    id: 3,
    name: "Organic Honey",
    price: "$12.99/jar",
    stock: 0,
    sold: 156,
    views: 890,
    status: "out_of_stock",
    image: "/organic-honey-jar.jpg",
  },
]

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "John Smith",
    product: "Fresh Organic Tomatoes",
    amount: "$49.90",
    status: "shipped",
    date: "2025-01-15",
  },
  {
    id: "#ORD-002",
    customer: "Sarah Johnson",
    product: "Premium Coffee Beans",
    amount: "$74.97",
    status: "processing",
    date: "2025-01-14",
  },
  {
    id: "#ORD-003",
    customer: "Mike Wilson",
    product: "Organic Honey",
    amount: "$25.98",
    status: "delivered",
    date: "2025-01-13",
  },
  {
    id: "#ORD-004",
    customer: "Emma Davis",
    product: "Fresh Organic Tomatoes",
    amount: "$24.95",
    status: "pending",
    date: "2025-01-12",
  },
]

export default function SellerDashboard() {
  return (
    <ProtectedRoute requireAuth={true} requiredUserType="supplier">
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
                <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                  Marketplace
                </Link>
                <Link href="/sell" className="text-foreground font-medium">
                  Seller Dashboard
                </Link>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Button variant="ghost">Profile</Button>
                <Button variant="outline">Logout</Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Green Valley Farm!</h1>
            <p className="text-muted-foreground">Manage your products, track sales, and grow your business.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,847</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">3 new this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">268</div>
                <p className="text-xs text-muted-foreground">+8.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,697</div>
                <p className="text-xs text-muted-foreground">+15.3% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products Management */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Products</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sellerProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">Price: {product.price}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm">Stock: {product.stock}</span>
                            <span className="text-sm">Sold: {product.sold}</span>
                            <span className="text-sm">Views: {product.views}</span>
                          </div>
                          <div className="mt-2">
                            <Progress value={(product.sold / (product.sold + product.stock)) * 100} className="h-2" />
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant={product.status === "active" ? "default" : "destructive"}>
                            {product.status === "active" ? "Active" : "Out of Stock"}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders & Analytics */}
            <div className="space-y-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.product}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{order.amount}</p>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "shipped"
                                  ? "secondary"
                                  : order.status === "processing"
                                    ? "outline"
                                    : "destructive"
                            }
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Orders
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Marketing Tools
                  </Button>
                </CardContent>
              </Card>
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
                    <Link href="/sell" className="hover:text-foreground transition-colors">
                      Seller Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="hover:text-foreground transition-colors">
                      Categories
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
