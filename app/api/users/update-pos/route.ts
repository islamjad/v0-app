import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { pointOfSaleId } = await request.json()

    // Update the user's point of sale
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        pointOfSaleId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update user point of sale:", error)
    return NextResponse.json({ error: "Failed to update user point of sale" }, { status: 500 })
  }
}

