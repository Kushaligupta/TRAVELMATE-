import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import User from "@/models/User"
import Session from "@/models/Session"
import { SESSION_COOKIE_NAME } from "../constants"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value
    if (!sessionId) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const session = await Session.findById(sessionId).populate("user")
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const u = (session as any).user

    const user = {
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      homeAirport: u.homeAirport,
      budgetLevel: u.budgetLevel,
      interests: u.interests,
      avatarUrl: u.avatarUrl,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (err) {
    console.error("Me error", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
