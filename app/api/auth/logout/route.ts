import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import Session from "@/models/Session"
import { SESSION_COOKIE_NAME } from "../constants"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value

    if (sessionId) {
      await Session.deleteOne({ _id: sessionId })
    }

    const res = NextResponse.json({ success: true })

    res.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    })

    return res
  } catch (err) {
    console.error("Logout error", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
