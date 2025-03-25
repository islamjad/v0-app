"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Package, Settings, User } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Package className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Sales Tracker</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/orders"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/orders" || pathname.startsWith("/orders/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Orders
        </Link>
        <Link
          href="/customers"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/customers" || pathname.startsWith("/customers/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Customers
        </Link>
        <Link
          href="/products"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/products" || pathname.startsWith("/products/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Products
        </Link>
        <Link
          href="/account"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/account" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <User className="h-4 w-4 md:hidden" />
          <span className="hidden md:inline">Account</span>
        </Link>
        <Link
          href="/settings"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/settings" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Settings className="h-4 w-4 md:hidden" />
          <span className="hidden md:inline">Settings</span>
        </Link>
      </nav>
    </div>
  )
}

