import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import User from "@/models/User"
import Session from "@/models/Session"
import bcrypt from "bcryptjs"
import { SESSION_COOKIE_NAME, SESSION_TTL_DAYS } from "../constants"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      )
    }

    const userDoc = await User.findOne({ email })
    if (!userDoc) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }

    const isValid = await bcrypt.compare(password, userDoc.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }

    const expiresAt = new Date(
      Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
    )

    const session = await Session.create({
      user: userDoc._id,
      expiresAt,
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

    const res = NextResponse.json({ user })

    // Cookie handling as per Next.js App Router docs :contentReference[oaicite:10]{index=10}
    res.cookies.set(SESSION_COOKIE_NAME, session._id.toString(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
    })

    return res
  } catch (err) {
    console.error("Login error", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
