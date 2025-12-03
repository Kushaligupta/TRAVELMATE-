"use client"

import { useAppData } from "@/context/app-data-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, Plane, Cloud, Car, AlertTriangle, X, Check } from "lucide-react"
import type { AlertType } from "@/lib/types"

const alertIcons: Record<AlertType, typeof Plane> = {
  flight: Plane,
  weather: Cloud,
  traffic: Car,
  emergency: AlertTriangle,
}

const alertColors: Record<AlertType, string> = {
  flight: "bg-chart-1/10 text-chart-1",
  weather: "bg-chart-2/10 text-chart-2",
  traffic: "bg-chart-4/10 text-chart-4",
  emergency: "bg-destructive/10 text-destructive",
}

export function NotificationsPopover() {
  const { alerts, unreadAlertCount, dismissAlert, markAlertRead } = useAppData()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadAlertCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadAlertCount > 9 ? "9+" : unreadAlertCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b border-border p-3">
          <h4 className="font-semibold text-foreground">Notifications</h4>
          <p className="text-xs text-muted-foreground">
            {unreadAlertCount > 0 ? `${unreadAlertCount} unread` : "All caught up!"}
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <Bell className="h-8 w-8 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {alerts.slice(0, 5).map((alert) => {
                const Icon = alertIcons[alert.type]
                return (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 p-3 ${!alert.read ? "bg-muted/50" : ""}`}
                    onClick={() => markAlertRead(alert.id)}
                  >
                    <div className={`rounded-lg p-1.5 ${alertColors[alert.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!alert.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            markAlertRead(alert.id)
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          dismissAlert(alert.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {alerts.length > 5 && (
          <div className="border-t border-border p-2">
            <p className="text-xs text-center text-muted-foreground">+{alerts.length - 5} more alerts</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
