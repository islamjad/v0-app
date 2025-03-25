"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Sample data
const customers = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Broadway St, Apt 4B, New York, NY 10001",
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Hollywood Blvd, Los Angeles, CA 90028",
  },
  {
    id: "CUST-003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 456-7890",
    address: "789 Michigan Ave, Chicago, IL 60601",
  },
  {
    id: "CUST-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 234-5678",
    address: "321 Texas St, Houston, TX 77002",
  },
  {
    id: "CUST-005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "+1 (555) 876-5432",
    address: "654 Beach Rd, Miami, FL 33139",
  },
]

// Updated products with variations
const products = [
  {
    id: "PRD-001",
    name: "Premium Coffee Beans",
    sku: "COFFEE-001",
    quantity: 50,
    price: 19.99,
    variations: [
      { id: "VAR-001", name: "Dark Roast", sku: "COFFEE-001-DR", quantity: 30 },
      { id: "VAR-002", name: "Medium Roast", sku: "COFFEE-001-MR", quantity: 20 },
    ],
  },
  {
    id: "PRD-002",
    name: "Ceramic Mug",
    sku: "MUG-001",
    quantity: 100,
    price: 14.99,
    variations: [
      { id: "VAR-003", name: "White", sku: "MUG-001-W", quantity: 50 },
      { id: "VAR-004", name: "Black", sku: "MUG-001-B", quantity: 30 },
      { id: "VAR-005", name: "Blue", sku: "MUG-001-BL", quantity: 20 },
    ],
  },
  {
    id: "PRD-003",
    name: "French Press",
    sku: "PRESS-001",
    quantity: 30,
    price: 29.99,
    variations: [
      { id: "VAR-006", name: "Silver", sku: "PRESS-001-S", quantity: 15 },
      { id: "VAR-007", name: "Copper", sku: "PRESS-001-C", quantity: 15 },
    ],
  },
  {
    id: "PRD-004",
    name: "Coffee Grinder",
    sku: "GRIND-001",
    quantity: 25,
    price: 39.99,
    variations: [
      { id: "VAR-008", name: "Black", sku: "GRIND-001-B", quantity: 15 },
      { id: "VAR-009", name: "Silver", sku: "GRIND-001-S", quantity: 10 },
    ],
  },
  {
    id: "PRD-005",
    name: "Espresso Beans",
    sku: "COFFEE-002",
    quantity: 45,
    price: 21.99,
    variations: [
      { id: "VAR-010", name: "Medium Roast", sku: "COFFEE-002-MR", quantity: 25 },
      { id: "VAR-011", name: "Dark Roast", sku: "COFFEE-002-DR", quantity: 20 },
    ],
  },
]

// Get system settings from localStorage or use defaults
const getSystemSettings = () => {
  if (typeof window !== "undefined") {
    const savedSettings = localStorage.getItem("systemSettings")
    if (savedSettings) {
      return JSON.parse(savedSettings)
    }
  }
  return { currency: "USD" }
}

export default function NewOrderPage() {
  const router = useRouter()
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [orderItems, setOrderItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedVariation, setSelectedVariation] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState("fixed") // 'fixed' or 'percentage'
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [customerDetails, setCustomerDetails] = useState(null)
  const [availableVariations, setAvailableVariations] = useState([])
  const [systemSettings, setSystemSettings] = useState({ currency: "USD" })

  useEffect(() => {
    // Load system settings
    setSystemSettings(getSystemSettings())
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      const customer = customers.find((c) => c.id === selectedCustomer)
      setCustomerDetails(customer)
    } else {
      setCustomerDetails(null)
    }
  }, [selectedCustomer])

  useEffect(() => {
    if (selectedProduct) {
      const product = products.find((p) => p.id === selectedProduct)
      if (product) {
        setAvailableVariations(product.variations)
        setSelectedVariation("")
      } else {
        setAvailableVariations([])
      }
    } else {
      setAvailableVariations([])
      setSelectedVariation("")
    }
  }, [selectedProduct])

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD":
        return "$"
      case "EUR":
        return "€"
      case "ILS":
        return "₪"
      default:
        return "$"
    }
  }

  const handleAddProduct = () => {
    if (!selectedProduct || !selectedVariation || quantity <= 0) return

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const variation = product.variations.find((v) => v.id === selectedVariation)
    if (!variation) return

    // Check if product variation already exists in order
    const existingItemIndex = orderItems.findIndex((item) => item.variation.id === variation.id)

    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      const updatedItems = [...orderItems]
      updatedItems[existingItemIndex].quantity += quantity
      updatedItems[existingItemIndex].total = Number(updatedItems[existingItemIndex].quantity) * Number(product.price)
      setOrderItems(updatedItems)
    } else {
      // Add new product to order
      setOrderItems([
        ...orderItems,
        {
          id: `ITEM-${Date.now()}`,
          product,
          variation,
          quantity,
          price: Number(product.price),
          total: Number(product.price) * Number(quantity),
        },
      ])
    }

    // Reset product selection
    setSelectedProduct("")
    setSelectedVariation("")
    setQuantity(1)
  }

  const handleRemoveItem = (itemId) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId))
  }

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal()
    if (discountType === "percentage") {
      return (subtotal * Number(discount)) / 100
    } else {
      return Number(discount)
    }
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discountAmount = calculateDiscount()
    // Simple tax calculation (5%)
    const tax = (subtotal - discountAmount) * 0.05
    return (subtotal - discountAmount + tax).toFixed(2)
  }

  const handleCreateOrder = () => {
    if (!selectedCustomer || orderItems.length === 0) {
      alert("Please select a customer and add at least one product")
      return
    }

    // In a real app, this would be an API call to create the order
    console.log({
      customer: selectedCustomer,
      items: orderItems,
      subtotal: calculateSubtotal(),
      discountType,
      discount,
      discountAmount: calculateDiscount(),
      tax: (calculateSubtotal() - calculateDiscount()) * 0.05,
      total: calculateTotal(),
      deliveryNotes,
      date: new Date().toISOString().split("T")[0],
      currency: systemSettings.currency,
    })

    // Navigate to orders page
    router.push("/orders")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Create New Order</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - {getCurrencySymbol(systemSettings.currency)}
                        {product.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="variation">Variation</Label>
                <Select
                  value={selectedVariation}
                  onValueChange={setSelectedVariation}
                  disabled={!selectedProduct || availableVariations.length === 0}
                >
                  <SelectTrigger id="variation">
                    <SelectValue placeholder="Select variation" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVariations.map((variation) => (
                      <SelectItem key={variation.id} value={variation.id}>
                        {variation.name} ({variation.quantity} in stock)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddProduct} className="mb-0.5" disabled={!selectedProduct || !selectedVariation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Variation</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.length > 0 ? (
                    orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell>{item.variation.name}</TableCell>
                        <TableCell>{item.variation.sku}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {getCurrencySymbol(systemSettings.currency)}
                          {item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {getCurrencySymbol(systemSettings.currency)}
                          {item.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No products added yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>
                  {getCurrencySymbol(systemSettings.currency)}
                  {calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm">Discount</span>
                  <RadioGroup
                    value={discountType}
                    onValueChange={setDiscountType}
                    className="flex items-center space-x-4 mt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed">Fixed Amount</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage">Percentage</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="w-32 flex items-center">
                  {discountType === "percentage" ? (
                    <div className="relative w-full">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-2">%</span>
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <span className="absolute left-3 top-2">{getCurrencySymbol(systemSettings.currency)}</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={discount}
                        onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                        className="pl-8"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount Amount</span>
                <span>
                  -{getCurrencySymbol(systemSettings.currency)}
                  {calculateDiscount().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%)</span>
                <span>
                  {getCurrencySymbol(systemSettings.currency)}
                  {((calculateSubtotal() - calculateDiscount()) * 0.05).toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>
                  {getCurrencySymbol(systemSettings.currency)}
                  {calculateTotal()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {customerDetails && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm">{customerDetails.email}</p>
                  <p className="text-sm">{customerDetails.phone}</p>
                  <Separator className="my-2" />
                  <p className="text-sm font-medium">Shipping Address:</p>
                  <p className="text-sm">{customerDetails.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any special instructions for delivery..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Items:</span>
                <span className="text-sm">{orderItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Quantity:</span>
                <span className="text-sm">{orderItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Currency:</span>
                <span className="text-sm">{systemSettings.currency}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>
                  {getCurrencySymbol(systemSettings.currency)}
                  {calculateTotal()}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleCreateOrder}
                disabled={!selectedCustomer || orderItems.length === 0}
              >
                Create Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

