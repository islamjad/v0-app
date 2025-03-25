"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function ProductDialog({ open, onOpenChange, product, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: 0,
    price: 0,
    image: "/placeholder.svg",
    variations: [],
  })

  const [newVariation, setNewVariation] = useState({
    name: "",
    sku: "",
    quantity: 0,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        price: product.price,
        image: product.image,
        variations: [...product.variations],
      })
    } else {
      setFormData({
        name: "",
        sku: "",
        quantity: 0,
        price: 0,
        image: "/placeholder.svg",
        variations: [],
      })
    }
  }, [product, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number.parseFloat(value) : value,
    }))
  }

  const handleVariationChange = (e) => {
    const { name, value } = e.target
    setNewVariation((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number.parseInt(value) : value,
    }))
  }

  const addVariation = () => {
    if (!newVariation.name || !newVariation.sku) return

    const variationId = `VAR-${Date.now()}`
    const updatedVariations = [...formData.variations, { ...newVariation, id: variationId }]

    // Update total quantity
    const totalQuantity = updatedVariations.reduce((sum, v) => sum + v.quantity, 0)

    setFormData((prev) => ({
      ...prev,
      variations: updatedVariations,
      quantity: totalQuantity,
    }))

    // Reset new variation form
    setNewVariation({
      name: "",
      sku: "",
      quantity: 0,
    })
  }

  const removeVariation = (variationId) => {
    const updatedVariations = formData.variations.filter((v) => v.id !== variationId)
    const totalQuantity = updatedVariations.reduce((sum, v) => sum + v.quantity, 0)

    setFormData((prev) => ({
      ...prev,
      variations: updatedVariations,
      quantity: totalQuantity,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Ensure we have at least one variation
    if (formData.variations.length === 0) {
      alert("Please add at least one variation")
      return
    }

    onSave(product ? { ...product, ...formData } : formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Update product information and variations." : "Fill in the details to add a new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU
              </Label>
              <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Image</Label>
              <div className="col-span-3">
                <Image
                  src={formData.image || "/placeholder.svg"}
                  alt="Product preview"
                  width={100}
                  height={100}
                  className="rounded-md object-cover mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  Using placeholder image. Image upload would be implemented in a real application.
                </p>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Variations</Label>
              <div className="col-span-3">
                <p className="text-sm text-muted-foreground mb-2">
                  Add variations of this product (color, size, flavor, etc.)
                </p>

                {formData.variations.length > 0 && (
                  <div className="mb-4 border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">SKU</th>
                          <th className="px-4 py-2 text-left">Quantity</th>
                          <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.variations.map((variation) => (
                          <tr key={variation.id} className="border-b">
                            <td className="px-4 py-2">{variation.name}</td>
                            <td className="px-4 py-2">{variation.sku}</td>
                            <td className="px-4 py-2">{variation.quantity}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                onClick={() => removeVariation(variation.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="variation-name">Name</Label>
                    <Input
                      id="variation-name"
                      name="name"
                      value={newVariation.name}
                      onChange={handleVariationChange}
                      placeholder="e.g. Dark Roast"
                    />
                  </div>
                  <div>
                    <Label htmlFor="variation-sku">SKU</Label>
                    <Input
                      id="variation-sku"
                      name="sku"
                      value={newVariation.sku}
                      onChange={handleVariationChange}
                      placeholder="e.g. COFFEE-001-DR"
                    />
                  </div>
                  <div>
                    <Label htmlFor="variation-quantity">Quantity</Label>
                    <Input
                      id="variation-quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      value={newVariation.quantity}
                      onChange={handleVariationChange}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addVariation}
                  disabled={!newVariation.name || !newVariation.sku}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variation
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Total Quantity
              </Label>
              <div className="col-span-3">
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">Total quantity is calculated from variations</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={formData.variations.length === 0}>
              {product ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

