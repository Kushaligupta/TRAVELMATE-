"use client"

import type React from "react"

import { useRef } from "react"
import { useAppData } from "@/context/app-data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Trash2, Map, Ticket, Info, CloudOff, Upload, FileJson } from "lucide-react"

export function OfflineTab() {
  const { trips, bookings, offlineItems, saveForOffline, removeOfflineItem, exportAllData, importData } = useAppData()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isItemSaved = (type: "itinerary" | "ticket", id: string) => {
    return offlineItems.some(
      (item) =>
        item.type === type && (type === "itinerary" ? (item.data as any).id === id : (item.data as any).id === id),
    )
  }

  const handleExport = () => {
    const data = exportAllData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `travelmate-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const success = importData(content)
      if (success) {
        alert("Data imported successfully!")
      } else {
        alert("Failed to import data. Please check the file format.")
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Offline Access</h1>
        <p className="text-muted-foreground">Save itineraries and tickets for offline viewing</p>
      </div>

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            Backup & Restore
          </CardTitle>
          <CardDescription>Export all your data as JSON or restore from a backup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export All Data
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </div>
        </CardContent>
      </Card>

      {/* Info Note */}
      <Card className="border-dashed border-primary/50 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">About Offline Mode</p>
              <p className="text-sm text-muted-foreground mt-1">
                Items saved here are stored in your browser's localStorage. For true offline access with no internet
                connection, a full implementation would use Service Workers and PWA technology.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Itineraries to Save */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Itineraries
            </CardTitle>
            <CardDescription>Save your trips for offline access</CardDescription>
          </CardHeader>
          <CardContent>
            {trips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Map className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">No itineraries to save</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map((trip) => {
                  const isSaved = isItemSaved("itinerary", trip.id)

                  return (
                    <div
                      key={trip.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{trip.destination}</p>
                        <p className="text-xs text-muted-foreground">{trip.segments.length} segments</p>
                      </div>
                      {isSaved ? (
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          <CloudOff className="mr-1 h-3 w-3" />
                          Saved
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => saveForOffline("itinerary", trip)}>
                          <Download className="mr-2 h-4 w-4" />
                          Save Offline
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bookings to Save */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              Tickets
            </CardTitle>
            <CardDescription>Save booking confirmations offline</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Ticket className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">No tickets to save</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => {
                  const isSaved = isItemSaved("ticket", booking.id)

                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {booking.confirmationId}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {booking.mode}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{booking.details}</p>
                      </div>
                      {isSaved ? (
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          <CloudOff className="mr-1 h-3 w-3" />
                          Saved
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => saveForOffline("ticket", booking)}>
                          <Download className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Saved Offline Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CloudOff className="h-5 w-5 text-primary" />
            Saved for Offline
          </CardTitle>
          <CardDescription>Items available without internet</CardDescription>
        </CardHeader>
        <CardContent>
          {offlineItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CloudOff className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">No items saved for offline access</p>
              <p className="text-xs text-muted-foreground">Save itineraries and tickets above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {offlineItems.map((item) => {
                const Icon = item.type === "itinerary" ? Map : Ticket

                return (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-secondary p-2">
                        <Icon className="h-4 w-4 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">
                          Saved: {new Date(item.savedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeOfflineItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
