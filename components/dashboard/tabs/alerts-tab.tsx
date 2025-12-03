"use client"

import { useState } from "react"
import { useAppData } from "@/context/app-data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Bell, Plane, Cloud, Car, AlertTriangle, X } from "lucide-react"
import type { AlertType } from "@/lib/types"

const alertTypes: { value: AlertType; label: string; icon: typeof Plane; color: string }[] = [
  { value: "flight", label: "Flight", icon: Plane, color: "bg-chart-1/10 text-chart-1" },
  { value: "weather", label: "Weather", icon: Cloud, color: "bg-chart-2/10 text-chart-2" },
  { value: "traffic", label: "Traffic", icon: Car, color: "bg-chart-4/10 text-chart-4" },
  { value: "emergency", label: "Emergency", icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
]

export function AlertsTab() {
  const { alerts, addAlert, dismissAlert } = useAppData()

  // Form state
  const [alertType, setAlertType] = useState<AlertType>("flight")
  const [message, setMessage] = useState("")

  const handleAddAlert = () => {
    if (!message) return
    addAlert({ type: alertType, message })
    setMessage("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Real-Time Alerts</h1>
        <p className="text-muted-foreground">
          Stay informed with flight status, weather, traffic, and emergency updates
        </p>
      </div>

      {/* Add Alert Form (for demo) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Alert (Demo)</CardTitle>
          <CardDescription>Simulate receiving alerts. In production, these would come from real APIs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full sm:w-48 space-y-2">
              <Label>Type</Label>
              <Select value={alertType} onValueChange={(v) => setAlertType(v as AlertType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {alertTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Message</Label>
              <Input
                placeholder="e.g., Flight AA123 delayed by 2 hours"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button onClick={handleAddAlert}>
              <Plus className="mr-2 h-4 w-4" />
              Add Alert
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Active Alerts
            {alerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {alerts.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Your current notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">No active alerts - all clear!</p>
              <p className="text-xs text-muted-foreground">Add a demo alert above to see how they appear.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const typeConfig = alertTypes.find((t) => t.value === alert.type)
                const Icon = typeConfig?.icon || Bell

                return (
                  <div key={alert.id} className="flex items-start gap-3 rounded-lg border border-border p-4">
                    <div className={`rounded-lg p-2 ${typeConfig?.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{typeConfig?.label}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-foreground">{alert.message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Note */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">About Real-Time Alerts</p>
              <p className="text-sm text-muted-foreground mt-1">
                In a production environment, this feature would integrate with real APIs for flight tracking, weather
                services, and traffic updates. Alerts would be pushed automatically based on your saved trips and
                preferences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
