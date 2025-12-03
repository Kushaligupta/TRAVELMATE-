"use client"

import { useState } from "react"
import { useAppData } from "@/context/app-data-context"
import { useAuth } from "@/context/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Map, Receipt, Phone, Heart, Loader2 } from "lucide-react"
import type { ExpenseCategory } from "@/lib/types"

interface QuickAddModalProps {
  type: "trip" | "expense" | "contact" | "favorite" | null
  onClose: () => void
}

const categories: ExpenseCategory[] = ["transport", "stay", "food", "activities", "other"]

export function QuickAddModal({ type, onClose }: QuickAddModalProps) {
  const { addTrip, addExpense, addFavorite } = useAppData()
  const { addEmergencyContact } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Trip form
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Expense form
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<ExpenseCategory>("food")
  const [paidBy, setPaidBy] = useState("")

  // Contact form
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")

  // Favorite form
  const [favName, setFavName] = useState("")
  const [favCountry, setFavCountry] = useState("")

  const resetForms = () => {
    setDestination("")
    setStartDate("")
    setEndDate("")
    setDescription("")
    setAmount("")
    setCategory("food")
    setPaidBy("")
    setContactName("")
    setContactPhone("")
    setFavName("")
    setFavCountry("")
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 300))

    switch (type) {
      case "trip":
        if (destination && startDate && endDate) {
          addTrip({ destination, startDate, endDate })
        }
        break
      case "expense":
        if (description && amount && paidBy) {
          addExpense({
            description,
            amount: Number.parseFloat(amount),
            category,
            groupMembers: [],
            paidBy,
          })
        }
        break
      case "contact":
        if (contactName && contactPhone) {
          addEmergencyContact({ name: contactName, phone: contactPhone })
        }
        break
      case "favorite":
        if (favName) {
          addFavorite({ name: favName, country: favCountry })
        }
        break
    }

    setIsLoading(false)
    resetForms()
    onClose()
  }

  const getConfig = () => {
    switch (type) {
      case "trip":
        return { title: "Add New Trip", description: "Quick add a trip to your itinerary", icon: Map }
      case "expense":
        return { title: "Add Expense", description: "Record a new expense", icon: Receipt }
      case "contact":
        return { title: "Add Emergency Contact", description: "Add a contact for emergencies", icon: Phone }
      case "favorite":
        return { title: "Add to Wishlist", description: "Save a dream destination", icon: Heart }
      default:
        return { title: "", description: "", icon: Map }
    }
  }

  const config = getConfig()

  return (
    <Dialog open={type !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <config.icon className="h-5 w-5 text-primary" />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {type === "trip" && (
            <>
              <div className="space-y-2">
                <Label>Destination</Label>
                <Input
                  placeholder="e.g., Paris, France"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {type === "expense" && (
            <>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="e.g., Dinner at restaurant"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Paid By</Label>
                <Input placeholder="Your name" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} />
              </div>
            </>
          )}

          {type === "contact" && (
            <>
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input
                  placeholder="e.g., John Doe"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="e.g., +1 234 567 8900"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
            </>
          )}

          {type === "favorite" && (
            <>
              <div className="space-y-2">
                <Label>Destination Name</Label>
                <Input placeholder="e.g., Santorini" value={favName} onChange={(e) => setFavName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Country (optional)</Label>
                <Input placeholder="e.g., Greece" value={favCountry} onChange={(e) => setFavCountry(e.target.value)} />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
