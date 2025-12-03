// models/Trip.ts
import mongoose, { Schema, Document, models } from "mongoose"

export interface ITrip extends Document {
  user: mongoose.Types.ObjectId
  destination: string
  startDate: Date
  endDate: Date
  status?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const TripSchema = new Schema<ITrip>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: String,
    notes: String,
  },
  { timestamps: true },
)

const Trip = models.Trip || mongoose.model<ITrip>("Trip", TripSchema)
export default Trip
