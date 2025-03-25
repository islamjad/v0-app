import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { PointOfSaleProvider } from "@/components/point-of-sale-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sales & Delivery Tracker",
  description: "Manage your sales, customers, and deliveries in one place",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Check if the current route is the login page
  const isLoginPage = children.props?.childProp?.segment === "login"

  // If not logged in and not on login page, redirect to login
  if (!session && !isLoginPage) {
    redirect("/login")
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {session ? (
            <PointOfSaleProvider>
              <div className="flex min-h-screen flex-col">
                <header className="border-b">
                  <div className="flex h-16 items-center px-4">
                    <MainNav />
                    <div className="ml-auto flex items-center space-x-4">
                      <UserNav />
                    </div>
                  </div>
                </header>
                {children}
              </div>
            </PointOfSaleProvider>
          ) : (
            children
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'