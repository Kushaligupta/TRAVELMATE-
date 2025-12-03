"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./tabs/overview-tab"
import { ItineraryTab } from "./tabs/itinerary-tab"
import { BookingsTab } from "./tabs/bookings-tab"
import { ExpensesTab } from "./tabs/expenses-tab"
import { AlertsTab } from "./tabs/alerts-tab"
import { NearbyTab } from "./tabs/nearby-tab"
import { OfflineTab } from "./tabs/offline-tab"
import { SafetyTab } from "./tabs/safety-tab"
import { FavoritesTab } from "./tabs/favorites-tab"
import { GroupsTab } from "./tabs/groups-tab"
import { LayoutDashboard, Map, Ticket, Receipt, Bell, MapPin, Download, Shield, Heart, Users } from "lucide-react"

const tabs = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "itinerary", label: "Itinerary", icon: Map },
  { value: "bookings", label: "Bookings", icon: Ticket },
  { value: "expenses", label: "Expenses", icon: Receipt },
  { value: "favorites", label: "Favorites", icon: Heart },
  { value: "groups", label: "Groups", icon: Users },
  { value: "alerts", label: "Alerts", icon: Bell },
  { value: "nearby", label: "Nearby", icon: MapPin },
  { value: "offline", label: "Offline", icon: Download },
  { value: "safety", label: "Safety", icon: Shield },
]

export function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="border-b border-border bg-card sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TabsList className="h-auto w-full justify-start gap-0 bg-transparent p-0 overflow-x-auto flex-nowrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none whitespace-nowrap"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <TabsContent value="overview" className="mt-0">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="itinerary" className="mt-0">
          <ItineraryTab />
        </TabsContent>
        <TabsContent value="bookings" className="mt-0">
          <BookingsTab />
        </TabsContent>
        <TabsContent value="expenses" className="mt-0">
          <ExpensesTab />
        </TabsContent>
        <TabsContent value="favorites" className="mt-0">
          <FavoritesTab />
        </TabsContent>
        <TabsContent value="groups" className="mt-0">
          <GroupsTab />
        </TabsContent>
        <TabsContent value="alerts" className="mt-0">
          <AlertsTab />
        </TabsContent>
        <TabsContent value="nearby" className="mt-0">
          <NearbyTab />
        </TabsContent>
        <TabsContent value="offline" className="mt-0">
          <OfflineTab />
        </TabsContent>
        <TabsContent value="safety" className="mt-0">
          <SafetyTab />
        </TabsContent>
      </div>
    </Tabs>
  )
}
