// models/Expense.ts
import mongoose, { Schema, Document, models } from "mongoose"

export interface IExpense extends Document {
  user: mongoose.Types.ObjectId
  trip?: mongoose.Types.ObjectId
  category: string
  amount: number
  currency: string
  date: Date
  note?: string
  createdAt: Date
}

const ExpenseSchema = new Schema<IExpense>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    trip: { type: Schema.Types.ObjectId, ref: "Trip" },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    date: { type: Date, required: true },
    note: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

const Expense = models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema)
export default Expense
