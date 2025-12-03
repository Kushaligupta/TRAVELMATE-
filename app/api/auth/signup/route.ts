import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 },
      )
    }

    const existing = await User.findOne({ email }).lean()
    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const userDoc = await User.create({
      name,
      email,
      passwordHash,
    })

    const user = {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      homeAirport: userDoc.homeAirport,
      budgetLevel: userDoc.budgetLevel,
      interests: userDoc.interests,
      avatarUrl: userDoc.avatarUrl,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    }

    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    console.error("Signup error", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
