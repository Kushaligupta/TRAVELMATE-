// lib/mongodb.ts
import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local")
}

// Reuse the same connection in dev so Next/Node hot reload doesn’t create multiple connections
export async function dbConnect() {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return
  }

  await mongoose.connect(MONGODB_URI)
}
