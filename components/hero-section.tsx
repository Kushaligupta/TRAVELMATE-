"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { Plane, Map, CreditCard, Bell, MapPin, Shield } from "lucide-react"

const features = [
  {
    icon: Map,
    title: "Smart Itineraries",
    description: "Plan and organize your trips with intelligent scheduling",
  },
  {
    icon: CreditCard,
    title: "Expense Tracking",
    description: "Manage budgets and split costs with travel companions",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Stay informed with flight, weather, and traffic updates",
  },
  {
    icon: MapPin,
    title: "Local Discoveries",
    description: "Find restaurants, attractions, and events near you",
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Emergency contacts and nearby help always accessible",
  },
  {
    icon: Plane,
    title: "Easy Bookings",
    description: "Search and book flights, hotels, trains, and more",
  },
]

export function HeroSection() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <div className="relative overflow-hidden">
        {/* Hero */}
        <div className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
                Your Journey, <span className="text-primary">Simplified</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
                Plan trips, track expenses, get real-time alerts, and discover local gems. TravelMate+ is your
                all-in-one travel companion for stress-free adventures.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" onClick={() => setShowAuthModal(true)} className="px-8">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" onClick={() => setShowAuthModal(true)}>
                  Login to Your Account
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
              Everything You Need for Better Travel
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Ready to Travel Smarter?</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of travelers who plan better trips with TravelMate+
            </p>
            <Button size="lg" className="mt-8" onClick={() => setShowAuthModal(true)}>
              Create Your Free Account
            </Button>
          </div>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}
