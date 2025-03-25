"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type PointOfSale = {
  id: string
  name: string
  logo?: string
}

type PointOfSaleContextType = {
  currentPointOfSale: PointOfSale | null
  setCurrentPointOfSale: (pos: PointOfSale) => void
  availablePointsOfSale: PointOfSale[]
}

const PointOfSaleContext = createContext<PointOfSaleContextType | undefined>(undefined)

export function PointOfSaleProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentPointOfSale, setCurrentPointOfSale] = useState<PointOfSale | null>(null)
  const [availablePointsOfSale, setAvailablePointsOfSale] = useState<PointOfSale[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPointsOfSale = async () => {
      if (!session?.user) return

      try {
        const response = await fetch("/api/points-of-sale")
        const data = await response.json()

        setAvailablePointsOfSale(data)

        // If user has a default point of sale, set it as current
        if (session.user.pointOfSaleId) {
          const userPos = data.find((pos: PointOfSale) => pos.id === session.user.pointOfSaleId)
          if (userPos) {
            setCurrentPointOfSale(userPos)
          } else if (data.length > 0) {
            // If user's POS not found but there are available POS, show dialog
            setIsDialogOpen(true)
          }
        } else if (data.length > 0) {
          // If user doesn't have a default POS but there are available ones, show dialog
          setIsDialogOpen(true)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch points of sale:", error)
        setIsLoading(false)
      }
    }

    fetchPointsOfSale()
  }, [session])

  const handleSelectPointOfSale = (posId: string) => {
    const selectedPos = availablePointsOfSale.find((pos) => pos.id === posId)
    if (selectedPos) {
      setCurrentPointOfSale(selectedPos)
      setIsDialogOpen(false)

      // Update user's default point of sale
      fetch("/api/users/update-pos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pointOfSaleId: posId }),
      })

      // Refresh the page to update data
      router.refresh()
    }
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <PointOfSaleContext.Provider value={{ currentPointOfSale, setCurrentPointOfSale, availablePointsOfSale }}>
      {children}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Point of Sale</DialogTitle>
            <DialogDescription>Please select the point of sale you want to work with.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pos">Point of Sale</Label>
              <Select onValueChange={handleSelectPointOfSale}>
                <SelectTrigger id="pos">
                  <SelectValue placeholder="Select a point of sale" />
                </SelectTrigger>
                <SelectContent>
                  {availablePointsOfSale.map((pos) => (
                    <SelectItem key={pos.id} value={pos.id}>
                      {pos.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PointOfSaleContext.Provider>
  )
}

export const usePointOfSale = () => {
  const context = useContext(PointOfSaleContext)
  if (context === undefined) {
    throw new Error("usePointOfSale must be used within a PointOfSaleProvider")
  }
  return context
}

