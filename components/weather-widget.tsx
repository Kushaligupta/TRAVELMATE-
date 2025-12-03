"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sun, Cloud, CloudRain, CloudSun } from "lucide-react"
import { getMockWeather } from "@/lib/mock-api"
import { useMemo } from "react"

interface WeatherWidgetProps {
  destination: string
  compact?: boolean
}

const weatherIcons: Record<string, typeof Sun> = {
  Sunny: Sun,
  "Partly Cloudy": CloudSun,
  Cloudy: Cloud,
  Rainy: CloudRain,
  Clear: Sun,
}

export function WeatherWidget({ destination, compact = false }: WeatherWidgetProps) {
  const weather = useMemo(() => getMockWeather(destination), [destination])
  const Icon = weatherIcons[weather.condition] || Sun

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-accent" />
        <span className="text-foreground">{weather.temp}°C</span>
        <span className="text-muted-foreground">{weather.condition}</span>
      </div>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-accent/10 to-transparent">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{destination}</p>
            <p className="text-3xl font-bold text-foreground">{weather.temp}°C</p>
            <p className="text-sm text-foreground">{weather.condition}</p>
            <p className="text-xs text-muted-foreground mt-1">{weather.description}</p>
          </div>
          <Icon className="h-16 w-16 text-accent" />
        </div>
      </CardContent>
    </Card>
  )
}
