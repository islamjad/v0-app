import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const pointOfSale = await prisma.pointOfSale.findUnique({
      where: {
        id: params.id,
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

    if (!pointOfSale) {
      return NextResponse.json({ error: "Point of sale not found" }, { status: 404 })
    }

    return NextResponse.json(pointOfSale)
  } catch (error) {
    console.error("Failed to fetch point of sale:", error)
    return NextResponse.json({ error: "Failed to fetch point of sale" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const pointOfSale = await prisma.pointOfSale.update({
      where: {
        id: params.id,
      },
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
    console.error("Failed to update point of sale:", error)
    return NextResponse.json({ error: "Failed to update point of sale" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if this is the last point of sale
    const count = await prisma.pointOfSale.count()
    if (count <= 1) {
      return NextResponse.json({ error: "Cannot delete the last point of sale" }, { status: 400 })
    }

    // Delete the point of sale
    await prisma.pointOfSale.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete point of sale:", error)
    return NextResponse.json({ error: "Failed to delete point of sale" }, { status: 500 })
  }
}

