"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample order data
const orderData = {
  "ORD-001": {
    id: "ORD-001",
    date: "2023-03-20",
    customer: {
      id: "CUST-001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Broadway St, Apt 4B, New York, NY 10001",
    },
    items: [
      {
        id: "ITEM-001",
        product: {
          id: "PRD-001",
          name: "Premium Coffee Beans",
          sku: "COFFEE-001",
        },
        quantity: 2,
        price: 19.99,
        total: 39.98,
      },
      {
        id: "ITEM-002",
        product: {
          id: "PRD-002",
          name: "Ceramic Mug",
          sku: "MUG-001",
        },
        quantity: 4,
        price: 14.99,
        total: 59.96,
      },
      {
        id: "ITEM-003",
        product: {
          id: "PRD-003",
          name: "French Press",
          sku: "PRESS-001",
        },
        quantity: 1,
        price: 29.99,
        total: 29.99,
      },
    ],
    subtotal: 129.93,
    discount: 10.0,
    tax: 5.07,
    total: 125.0,
    status: "delivered",
    deliveryNotes: "Please leave at the front door.",
  },
  "ORD-002": {
    id: "ORD-002",
    date: "2023-03-19",
    customer: {
      id: "CUST-002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
      address: "456 Hollywood Blvd, Los Angeles, CA 90028",
    },
    items: [
      {
        id: "ITEM-004",
        product: {
          id: "PRD-004",
          name: "Coffee Grinder",
          sku: "GRIND-001",
        },
        quantity: 1,
        price: 39.99,
        total: 39.99,
      },
      {
        id: "ITEM-005",
        product: {
          id: "PRD-005",
          name: "Espresso Beans",
          sku: "COFFEE-002",
        },
        quantity: 2,
        price: 21.99,
        total: 43.98,
      },
    ],
    subtotal: 83.97,
    discount: 0,
    tax: 1.53,
    total: 85.5,
    status: "processing",
    deliveryNotes: "Call before delivery.",
  },
}

export default function OrderDetailsPage() {
  const params = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    if (params.id && orderData[params.id]) {
      setOrder(orderData[params.id])
    }
    setLoading(false)
  }, [params.id])

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>
  }

  if (!order) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center mb-6">
          <Link href="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p>The order you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "shipped":
        return <Badge className="bg-blue-500">Shipped</Badge>
      case "processing":
        return <Badge className="bg-yellow-500">Processing</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            Order {order.id} - {getStatusBadge(order.status)}
          </h1>
        </div>
        <Button variant="outline" size="sm">
          <Printer className="mr-2 h-4 w-4" />
          Print Order
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>Ordered on {new Date(order.date).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell>{item.product.sku}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            {order.deliveryNotes && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Delivery Notes</h3>
                <p className="text-sm text-muted-foreground">{order.deliveryNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Contact Details</h3>
                <p className="text-sm">{order.customer.name}</p>
                <p className="text-sm">{order.customer.email}</p>
                <p className="text-sm">{order.customer.phone}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Shipping Address</h3>
                <p className="text-sm whitespace-pre-line">{order.customer.address}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Actions</h3>
                <div className="flex flex-col gap-2 mt-2">
                  <Link href={`/customers/${order.customer.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Customer
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full">
                    Send Invoice
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

