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

    const pointsOfSale = await prisma.pointOfSale.findMany({
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(pointsOfSale)
  } catch (error) {
    console.error("Failed to fetch points of sale:", error)
    return NextResponse.json({ error: "Failed to fetch points of sale" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const pointOfSale = await prisma.pointOfSale.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        logo: data.logo,
        status: data.status,
        managerId: data.managerId || null,
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(pointOfSale)
  } catch (error) {
    console.error("Failed to create point of sale:", error)
    return NextResponse.json({ error: "Failed to create point of sale" }, { status: 500 })
  }
}

