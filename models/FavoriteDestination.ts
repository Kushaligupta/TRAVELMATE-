// models/FavoriteDestination.ts
import mongoose, { Schema, Document, models } from "mongoose"

export interface IFavoriteDestination extends Document {
  user: mongoose.Types.ObjectId
  title: string
  city?: string
  country?: string
  note?: string
  addedAt: Date
}

const FavoriteDestinationSchema = new Schema<IFavoriteDestination>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  city: String,
  country: String,
  note: String,
  addedAt: { type: Date, default: Date.now },
})

const FavoriteDestination =
  models.FavoriteDestination ||
  mongoose.model<IFavoriteDestination>("FavoriteDestination", FavoriteDestinationSchema)

export default FavoriteDestination
