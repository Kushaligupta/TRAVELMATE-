"use client"

import { useState } from "react"
import { useAppData } from "@/context/app-data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, Trash2, MapPin, Globe } from "lucide-react"
import { WeatherWidget } from "@/components/weather-widget"

export function FavoritesTab() {
  const { favorites, addFavorite, removeFavorite, trips, toggleTripFavorite } = useAppData()
  const [name, setName] = useState("")
  const [country, setCountry] = useState("")

  const favoriteTrips = trips.filter((t) => t.isFavorite)

  const handleAddFavorite = () => {
    if (!name) return
    addFavorite({ name, country })
    setName("")
    setCountry("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Favorites & Wishlist</h1>
        <p className="text-muted-foreground">Save destinations you want to visit</p>
      </div>

      {/* Add Favorite Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add to Wishlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label>Destination Name</Label>
              <Input placeholder="e.g., Santorini" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Country (optional)</Label>
              <Input placeholder="e.g., Greece" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <Button onClick={handleAddFavorite}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Wishlist Destinations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-destructive" />
              Wishlist Destinations
            </CardTitle>
            <CardDescription>Places you dream of visiting</CardDescription>
          </CardHeader>
          <CardContent>
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Heart className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">No destinations saved yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((fav) => (
                  <div key={fav.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-destructive/10 p-2">
                        <MapPin className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{fav.name}</p>
                        {fav.country && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {fav.country}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <WeatherWidget destination={fav.name} compact />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFavorite(fav.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorite Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary fill-primary" />
              Favorite Trips
            </CardTitle>
            <CardDescription>Your starred trips</CardDescription>
          </CardHeader>
          <CardContent>
            {favoriteTrips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Heart className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">No favorite trips yet</p>
                <p className="text-xs text-muted-foreground">Click the heart on any trip to add it here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-foreground">{trip.destination}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{trip.segments.length} segments</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => toggleTripFavorite(trip.id)}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
