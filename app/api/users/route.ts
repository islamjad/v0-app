import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { hash } from "bcrypt"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pointOfSaleId = searchParams.get("pointOfSaleId")

    // If admin, can see all users or filter by POS
    // If manager, can only see users in their POS
    const where =
      session.user.role === "admin" && pointOfSaleId
        ? { pointOfSaleId }
        : session.user.role === "admin"
          ? {}
          : { pointOfSaleId: session.user.pointOfSaleId }

    const users = await prisma.user.findMany({
      where,
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

    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "manager")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate role permissions
    if (session.user.role !== "admin" && data.role === "admin") {
      return NextResponse.json({ error: "Only admins can create admin users" }, { status: 403 })
    }

    // Set point of sale ID based on role
    const pointOfSaleId = session.user.role === "admin" ? data.pointOfSaleId : session.user.pointOfSaleId

    // Hash password
    const hashedPassword = await hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        status: data.status,
        pointOfSaleId,
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

    return NextResponse.json(user)
  } catch (error) {
    console.error("Failed to create user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

