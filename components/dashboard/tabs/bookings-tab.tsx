"use client"

import { useState, useMemo } from "react"
import { useAppData } from "@/context/app-data-context"
import { searchBookings } from "@/lib/mock-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Plane,
  Train,
  Bus,
  Hotel,
  Car,
  Search,
  Loader2,
  Ticket,
  Trash2,
  Star,
  Clock,
  Filter,
  Heart,
} from "lucide-react"
import type { BookingMode, BookingResult } from "@/lib/types"

const modes: { value: BookingMode; label: string; icon: typeof Plane }[] = [
  { value: "flight", label: "Flight", icon: Plane },
  { value: "train", label: "Train", icon: Train },
  { value: "bus", label: "Bus", icon: Bus },
  { value: "hotel", label: "Hotel", icon: Hotel },
  { value: "cab", label: "Cab", icon: Car },
]

export function BookingsTab() {
  const { bookings, addBooking, removeBooking, toggleBookingFavorite } = useAppData()
  const [mode, setMode] = useState<BookingMode>("flight")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<BookingResult[]>([])

  // Search form
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [city, setCity] = useState("")
  const [date, setDate] = useState("")
  const [passengers, setPassengers] = useState("1")

  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [minRating, setMinRating] = useState(0)

  const handleSearch = async () => {
    if (!date) return
    if (mode === "hotel" && !city) return
    if (mode !== "hotel" && (!from || !to)) return

    setIsSearching(true)
    const searchResults = await searchBookings(mode, {
      from,
      to,
      city,
      date,
      passengers: Number.parseInt(passengers),
      guests: Number.parseInt(passengers),
    })
    setResults(searchResults)
    setIsSearching(false)
  }

  const handleBook = (result: BookingResult) => {
    addBooking(result)
    setResults(results.filter((r) => r.id !== result.id))
  }

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      if (r.price < priceRange[0] || r.price > priceRange[1]) return false
      if (r.rating && r.rating < minRating) return false
      return true
    })
  }, [results, priceRange, minRating])

  const isHotelMode = mode === "hotel"
  const ModeIcon = modes.find((m) => m.value === mode)?.icon || Plane

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Seamless Booking</h1>
        <p className="text-muted-foreground">Search and book flights, trains, buses, hotels, and cabs</p>
      </div>

      {/* Mode Selection */}
      <div className="flex flex-wrap gap-2">
        {modes.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant={mode === value ? "default" : "outline"}
            onClick={() => {
              setMode(value)
              setResults([])
            }}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ModeIcon className="h-5 w-5 text-primary" />
            Search {modes.find((m) => m.value === mode)?.label}s
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {isHotelMode ? (
              <div className="flex-1 space-y-2">
                <Label>City</Label>
                <Input placeholder="e.g., New York" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-2">
                  <Label>From</Label>
                  <Input placeholder="e.g., New York" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>To</Label>
                  <Input placeholder="e.g., Los Angeles" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="w-24 space-y-2">
              <Label>{isHotelMode ? "Guests" : "Travelers"}</Label>
              <Input type="number" min="1" value={passengers} onChange={(e) => setPassengers(e.target.value)} />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Search Results</CardTitle>
                <CardDescription>
                  {filteredResults.length} of {results.length} options shown
                </CardDescription>
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showFilters && (
              <div className="mb-4 p-4 rounded-lg bg-muted/50 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Minimum Rating: {minRating} stars</Label>
                  <div className="flex gap-1">
                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinRating(rating)}
                      >
                        {rating === 0 ? "All" : `${rating}+`}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {filteredResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-secondary p-2">
                      <ModeIcon className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{result.provider}</p>
                        {result.rating && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="mr-1 h-3 w-3 fill-accent text-accent" />
                            {result.rating}
                          </Badge>
                        )}
                        {result.duration && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="mr-1 h-3 w-3" />
                            {result.duration}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{result.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-foreground">${result.price}</span>
                    <Button onClick={() => handleBook(result)}>Book & Save</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Your Confirmations
          </CardTitle>
          <CardDescription>Your saved booking confirmations</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Ticket className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">No bookings yet. Search and book above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => {
                const modeConfig = modes.find((m) => m.value === booking.mode)
                const Icon = modeConfig?.icon || Ticket

                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {booking.confirmationId}
                          </Badge>
                          <Badge variant="secondary">{modeConfig?.label || booking.mode}</Badge>
                          {booking.isFavorite && <Heart className="h-4 w-4 text-destructive fill-destructive" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{booking.details}</p>
                        <p className="text-xs text-muted-foreground">
                          Booked: {new Date(booking.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">${booking.price}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleBookingFavorite(booking.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${booking.isFavorite ? "text-destructive fill-destructive" : "text-muted-foreground"}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeBooking(booking.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
