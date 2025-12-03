// models/User.ts
import mongoose, { Schema, Document, models } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  homeAirport?: string
  budgetLevel?: string
  interests: string[]
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    homeAirport: String,
    budgetLevel: String,
    interests: { type: [String], default: [] },

    avatarUrl: String,
  },
  { timestamps: true },
)

const User = models.User || mongoose.model<IUser>("User", UserSchema)
export default User
