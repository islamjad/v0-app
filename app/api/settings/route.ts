import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the first settings record or create default
    let settings = await prisma.systemSettings.findFirst()

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          companyName: "My Company",
          currency: "USD",
          taxRate: 0.05,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "manager")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Get the first settings record or create default
    let settings = await prisma.systemSettings.findFirst()

    if (settings) {
      // Update existing settings
      settings = await prisma.systemSettings.update({
        where: {
          id: settings.id,
        },
        data: {
          companyName: data.companyName,
          taxId: data.taxId,
          address: data.address,
          phone: data.phone,
          currency: data.currency,
          darkMode: data.darkMode,
          emailNotifications: data.emailNotifications,
          autoBackup: data.autoBackup,
        },
      })
    } else {
      // Create new settings
      settings = await prisma.systemSettings.create({
        data: {
          companyName: data.companyName,
          taxId: data.taxId,
          address: data.address,
          phone: data.phone,
          currency: data.currency,
          darkMode: data.darkMode,
          emailNotifications: data.emailNotifications,
          autoBackup: data.autoBackup,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Failed to update settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

