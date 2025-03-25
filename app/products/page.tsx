"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProductDialog } from "@/components/product-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Sample product data with variations
const initialProducts = [
  {
    id: "PRD-001",
    name: "Premium Coffee Beans",
    sku: "COFFEE-001",
    quantity: 50,
    image: "/placeholder.svg",
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
    image: "/placeholder.svg",
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
    image: "/placeholder.svg",
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
    image: "/placeholder.svg",
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
    image: "/placeholder.svg",
    price: 21.99,
    variations: [
      { id: "VAR-010", name: "Medium Roast", sku: "COFFEE-002-MR", quantity: 25 },
      { id: "VAR-011", name: "Dark Roast", sku: "COFFEE-002-DR", quantity: 20 },
    ],
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.variations.some(
        (v) =>
          v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  const handleAddProduct = (newProduct) => {
    const productId = `PRD-${String(products.length + 1).padStart(3, "0")}`
    setProducts([...products, { ...newProduct, id: productId }])
  }

  const handleEditProduct = (updatedProduct) => {
    setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
  }

  const openAddDialog = () => {
    setCurrentProduct(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (product) => {
    setCurrentProduct(product)
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter((product) => product.id !== productToDelete.id))
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Variations</TableHead>
              <TableHead>Total Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.variations.map((variation) => (
                        <Badge key={variation.id} variant="outline" className="mr-1">
                          {variation.name} ({variation.quantity})
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.quantity > 10 ? "outline" : "destructive"}>{product.quantity}</Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => openDeleteDialog(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={currentProduct}
        onSave={currentProduct ? handleEditProduct : handleAddProduct}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product {productToDelete?.name} and all its variations. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

