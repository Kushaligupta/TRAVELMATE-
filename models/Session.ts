// models/Session.ts
import mongoose, { Schema, Document, models } from "mongoose"

export interface ISession extends Document {
  user: mongoose.Types.ObjectId
  expiresAt: Date
  createdAt: Date
}

const SessionSchema = new Schema<ISession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

const Session = models.Session || mongoose.model<ISession>("Session", SessionSchema)
export default Session
