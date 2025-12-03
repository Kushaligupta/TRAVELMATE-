"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
import { QuickActionsFab } from "@/components/quick-actions-fab"
import { QuickAddModal } from "@/components/quick-add-modal"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const [quickAddType, setQuickAddType] = useState<"trip" | "expense" | "contact" | "favorite" | null>(null)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {user ? (
        <>
          <DashboardTabs />
          <QuickActionsFab
            onAddTrip={() => setQuickAddType("trip")}
            onAddExpense={() => setQuickAddType("expense")}
            onAddContact={() => setQuickAddType("contact")}
            onAddFavorite={() => setQuickAddType("favorite")}
          />
          <QuickAddModal type={quickAddType} onClose={() => setQuickAddType(null)} />
        </>
      ) : (
        <HeroSection />
      )}
    </div>
  )
}
