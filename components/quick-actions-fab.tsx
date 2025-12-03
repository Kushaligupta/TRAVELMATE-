"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Map, Receipt, Phone, X, Heart } from "lucide-react"

interface QuickActionsFabProps {
  onAddTrip: () => void
  onAddExpense: () => void
  onAddContact: () => void
  onAddFavorite: () => void
}

export function QuickActionsFab({ onAddTrip, onAddExpense, onAddContact, onAddFavorite }: QuickActionsFabProps) {
  const [open, setOpen] = useState(false)

  const actions = [
    { label: "Add Trip", icon: Map, onClick: onAddTrip, color: "bg-primary text-primary-foreground" },
    { label: "Add Expense", icon: Receipt, onClick: onAddExpense, color: "bg-accent text-accent-foreground" },
    { label: "Add Favorite", icon: Heart, onClick: onAddFavorite, color: "bg-destructive text-destructive-foreground" },
    { label: "Add Contact", icon: Phone, onClick: onAddContact, color: "bg-success text-success-foreground" },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105">
            {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="end" side="top" sideOffset={8}>
          <div className="flex flex-col gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                className="justify-start gap-3"
                onClick={() => {
                  action.onClick()
                  setOpen(false)
                }}
              >
                <div className={`rounded-full p-1.5 ${action.color}`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
