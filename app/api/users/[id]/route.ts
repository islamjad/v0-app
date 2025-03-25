import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { hash } from "bcrypt"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        pointOfSaleId: true,
        pointOfSale: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has permission to view this user
    if (session.user.role !== "admin" && user.pointOfSaleId !== session.user.pointOfSaleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "manager")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Get the user to update
    const existingUser = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check permissions
    if (session.user.role !== "admin" && existingUser.pointOfSaleId !== session.user.pointOfSaleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Only admins can change roles to admin
    if (session.user.role !== "admin" && data.role === "admin") {
      return NextResponse.json({ error: "Only admins can create admin users" }, { status: 403 })
    }

    // Set point of sale ID based on role
    const pointOfSaleId = session.user.role === "admin" ? data.pointOfSaleId : session.user.pointOfSaleId

    // Prepare update data
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      pointOfSaleId,
    }

    // Only update password if provided
    if (data.password) {
      updateData.password = await hash(data.password, 10)
    }

    const user = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        pointOfSaleId: true,
        pointOfSale: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Failed to update user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "manager")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user to delete
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check permissions
    if (session.user.role !== "admin" && user.pointOfSaleId !== session.user.pointOfSaleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Cannot delete yourself
    if (user.id === session.user.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    // Cannot delete admin users unless you're an admin
    if (user.role === "admin" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Only admins can delete admin users" }, { status: 403 })
    }

    await prisma.user.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

