import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
        { status: 400 },
      )
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 2MB." }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")

    // Generate a unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${uuidv4()}-${file.name.replace(/\s/g, "-")}`
    const filepath = join(uploadsDir, filename)

    // Write the file
    await writeFile(filepath, buffer)

    // Return the URL to the uploaded file
    const url = `/uploads/${filename}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Failed to upload file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

