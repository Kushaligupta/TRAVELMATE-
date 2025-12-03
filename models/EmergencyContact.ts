// models/EmergencyContact.ts
import mongoose, { Schema, Document, models } from "mongoose"

export interface IEmergencyContact extends Document {
  user: mongoose.Types.ObjectId
  name: string
  phone: string
  createdAt: Date
}

const EmergencyContactSchema = new Schema<IEmergencyContact>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

const EmergencyContact =
  models.EmergencyContact ||
  mongoose.model<IEmergencyContact>("EmergencyContact", EmergencyContactSchema)

export default EmergencyContact
