import Link from "next/link"
import { ArrowRight, BarChart3, Package, ShoppingCart, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyDisplay } from "@/components/currency-display"

// Sample data for dashboard
const dashboardData = {
  totalOrders: 5,
  totalCustomers: 5,
  totalProducts: 5,
  totalRevenue: 616.5,
  orderGrowth: 2,
  customerGrowth: 1,
  productGrowth: 3,
  revenueGrowth: 15,
  recentOrders: [
    {
      id: "ORD-001",
      customer: "John Doe",
      total: 125.0,
      date: "2023-03-20",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      total: 85.5,
      date: "2023-03-19",
    },
    {
      id: "ORD-003",
      customer: "Robert Johnson",
      total: 210.75,
      date: "2023-03-18",
    },
  ],
  topProducts: [
    {
      name: "Premium Coffee Beans",
      sku: "COFFEE-001",
      sold: 32,
      revenue: 640.0,
    },
    {
      name: "Ceramic Mug",
      sku: "MUG-001",
      sold: 28,
      revenue: 420.0,
    },
    {
      name: "French Press",
      sku: "PRESS-001",
      sold: 24,
      revenue: 720.0,
    },
  ],
}

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Sales & Delivery Tracker
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Manage your customers, products, and orders in one place.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/orders/new">
                  <Button>
                    Create New Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">+{dashboardData.orderGrowth} from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">+{dashboardData.customerGrowth} from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">+{dashboardData.productGrowth} from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <CurrencyDisplay amount={dashboardData.totalRevenue} />
                  </div>
                  <p className="text-xs text-muted-foreground">+{dashboardData.revenueGrowth}% from last month</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Recent orders placed in your store.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            <CurrencyDisplay amount={order.total} />
                          </p>
                          <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/orders">
                    <Button variant="outline" size="sm">
                      View All Orders
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Your best-selling products this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.topProducts.map((product) => (
                      <div key={product.sku} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{product.sold} sold</p>
                          <p className="text-sm text-muted-foreground">
                            <CurrencyDisplay amount={product.revenue} />
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/products">
                    <Button variant="outline" size="sm">
                      View All Products
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

