"use client"

import { useAuth } from "@/context/auth-context"
import { useAppData } from "@/context/app-data-context"
import { useSettings } from "@/context/settings-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileCard } from "./profile-card"
import { CurrencyConverter } from "@/components/currency-converter"
import { Map, Receipt, Bell, Calendar, Heart } from "lucide-react"

export function OverviewTab() {
  const { user } = useAuth()
  const { trips, expenses, alerts, favorites } = useAppData()
  const { t } = useSettings()

  const upcomingTrips = trips.filter((trip) => new Date(trip.startDate) >= new Date()).length
  const favoriteTrips = trips.filter((trip) => trip.isFavorite).length

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const activeAlerts = alerts.filter((a) => !a.read).length

  const stats = [
    {
      title: t("totalTrips"),
      value: trips.length,
      subtitle: `${upcomingTrips} ${t("upcoming")}`,
      icon: Map,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: t("totalExpenses"),
      value: `$${totalExpenses.toLocaleString()}`,
      subtitle: `${expenses.length} ${t("transactions")}`,
      icon: Receipt,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: t("activeAlerts"),
      value: activeAlerts,
      subtitle: activeAlerts === 0 ? t("allClear") : t("needsAttention"),
      icon: Bell,
      color: activeAlerts > 0 ? "text-destructive" : "text-success",
      bg: activeAlerts > 0 ? "bg-destructive/10" : "bg-success/10",
    },
    {
      title: "Favorites",
      value: favorites.length + favoriteTrips,
      subtitle: `${favorites.length} destinations, ${favoriteTrips} trips`,
      icon: Heart,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("welcomeBack")}, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">{t("overviewSubtitle")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Trips, Profile & Currency Converter */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t("recentTrips")}
            </CardTitle>
            <CardDescription>Your latest travel plans</CardDescription>
          </CardHeader>
          <CardContent>
            {trips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Map className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">{t("noTripsYet")}</p>
                <p className="text-xs text-muted-foreground">Head to the Itinerary tab to plan your first adventure!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.slice(0, 3).map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{trip.destination}</p>
                        {trip.isFavorite && <Heart className="h-3 w-3 text-destructive fill-destructive" />}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                      {trip.segments.length} segments
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Card */}
        <ProfileCard />

        <CurrencyConverter />
      </div>
    </div>
  )
}
