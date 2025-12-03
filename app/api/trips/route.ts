import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import Session from "@/models/Session"
import Trip from "@/models/Trip"
import { SESSION_COOKIE_NAME } from "../auth/constants"

async function getCurrentUserId(req: NextRequest) {
  await dbConnect()
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!sessionId) return null

  const session = await Session.findById(sessionId)
  if (!session || session.expiresAt < new Date()) return null

  return session.user.toString()
}

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId(req)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const trips = await Trip.find({ user: userId }).sort({ startDate: 1 }).lean()
  return NextResponse.json({ trips })
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId(req)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { destination, startDate, endDate, status, notes } = await req.json()

  const tripDoc = await Trip.create({
    user: userId,
    destination,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    status,
    notes,
  })

  const trip = {
    id: tripDoc._id.toString(),
    destination: tripDoc.destination,
    startDate: tripDoc.startDate,
    endDate: tripDoc.endDate,
    status: tripDoc.status,
    notes: tripDoc.notes,
  }

  return NextResponse.json({ trip }, { status: 201 })
}
