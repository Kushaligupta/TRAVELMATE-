"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { getRecommendedPlaces, getEmergencyPlaces } from "@/lib/mock-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Utensils, Landmark, Calendar, Shield, Loader2, AlertCircle } from "lucide-react"
import type { Place, PlaceType } from "@/lib/types"

const placeIcons: Record<PlaceType, typeof Utensils> = {
  restaurant: Utensils,
  attraction: Landmark,
  event: Calendar,
  emergency: Shield,
}

const placeColors: Record<PlaceType, string> = {
  restaurant: "bg-chart-3/10 text-chart-3",
  attraction: "bg-chart-1/10 text-chart-1",
  event: "bg-chart-4/10 text-chart-4",
  emergency: "bg-destructive/10 text-destructive",
}

interface GeoLocation {
  lat: number
  lng: number
}

export function NearbyTab() {
  const { user } = useAuth()
  const [location, setLocation] = useState<GeoLocation | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)

  const [recommendedPlaces, setRecommendedPlaces] = useState<Place[]>([])
  const [emergencyPlaces, setEmergencyPlaces] = useState<Place[]>([])

  useEffect(() => {
    // Request geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLoadingLocation(false)
        },
        (error) => {
          setLocationError(
            error.code === 1
              ? "Location access denied. Please enable location services."
              : "Unable to get your location. Please try again.",
          )
          setIsLoadingLocation(false)
        },
      )
    } else {
      setLocationError("Geolocation is not supported by your browser.")
      setIsLoadingLocation(false)
    }
  }, [])

  useEffect(() => {
    // Get recommended places based on user interests
    const interests = user?.preferences?.interests || []
    setRecommendedPlaces(getRecommendedPlaces(interests))
    setEmergencyPlaces(getEmergencyPlaces())
  }, [user?.preferences?.interests])

  const retryLocation = () => {
    setIsLoadingLocation(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsLoadingLocation(false)
      },
      (error) => {
        setLocationError("Unable to get your location.")
        setIsLoadingLocation(false)
      },
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nearby & Recommendations</h1>
        <p className="text-muted-foreground">Discover restaurants, attractions, and events based on your interests</p>
      </div>

      {/* Location Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Your Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLocation ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-muted-foreground">Getting your location...</span>
            </div>
          ) : locationError ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span className="text-muted-foreground">{locationError}</span>
              </div>
              <Button variant="outline" size="sm" onClick={retryLocation}>
                Retry
              </Button>
            </div>
          ) : location ? (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <MapPin className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">Location acquired</p>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Recommended for You
          </CardTitle>
          <CardDescription>
            {user?.preferences?.interests?.length
              ? `Based on your interests: ${user.preferences.interests.join(", ")}`
              : "Update your interests in Profile to get personalized recommendations"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendedPlaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">No recommendations match your interests</p>
              <p className="text-xs text-muted-foreground">Add interests in your profile to see personalized places</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {recommendedPlaces.map((place) => {
                const Icon = placeIcons[place.type]

                return (
                  <div key={place.id} className="flex items-start gap-3 rounded-lg border border-border p-4">
                    <div className={`rounded-lg p-2 ${placeColors[place.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{place.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {place.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            Nearby Emergency Services
          </CardTitle>
          <CardDescription>Important safety locations near you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyPlaces.map((place) => (
              <div key={place.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="rounded-lg bg-destructive/10 p-2">
                  <Shield className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{place.name}</p>
                  <p className="text-xs text-muted-foreground">{place.tags.join(" • ")}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
