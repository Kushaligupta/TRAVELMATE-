import type { BookingMode, BookingResult, Place } from "./types"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock booking search
export async function searchBookings(
  mode: BookingMode,
  params: {
    from?: string
    to?: string
    city?: string
    date: string
    passengers?: number
    guests?: number
  },
): Promise<BookingResult[]> {
  await delay(800) // Simulate network delay

  const providers: Record<BookingMode, string[]> = {
    flight: ["AirSky", "JetWings", "CloudAir", "SkyBound"],
    train: ["RailExpress", "FastTrack", "TrainGo"],
    bus: ["RedBus", "GreenLine", "ComfortCoach"],
    hotel: ["StayInn", "TravelLodge", "ComfortSuites", "GrandHotel"],
    cab: ["QuickRide", "CityCab", "GoTaxi"],
  }

  const basePrice: Record<BookingMode, number> = {
    flight: 150,
    train: 45,
    bus: 25,
    hotel: 80,
    cab: 15,
  }

  const durations: Record<BookingMode, string[]> = {
    flight: ["2h 15m", "3h 30m", "4h 45m", "1h 50m"],
    train: ["4h 30m", "6h 15m", "8h 00m"],
    bus: ["5h 00m", "7h 30m", "10h 00m"],
    hotel: ["1 night", "2 nights", "3 nights", "5 nights"],
    cab: ["25 min", "40 min", "1h 15m"],
  }

  const modeProviders = providers[mode]
  const base = basePrice[mode]
  const modeDurations = durations[mode]

  return modeProviders.map((provider, index) => ({
    id: `${mode}-${Date.now()}-${index}`,
    mode,
    provider,
    price: Math.round(base * (0.8 + Math.random() * 0.6)),
    details:
      mode === "hotel"
        ? `${params.city} • ${params.guests || 1} guest(s) • ${params.date}`
        : `${params.from} → ${params.to} • ${params.date}`,
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, // Added rating
    duration: modeDurations[index % modeDurations.length], // Added duration
  }))
}

// Mock places for location-based recommendations
export const mockPlaces: Place[] = [
  { id: "1", type: "restaurant", name: "The Local Kitchen", tags: ["food", "local", "casual"] },
  { id: "2", type: "restaurant", name: "Seaside Grill", tags: ["food", "seafood", "fine-dining"] },
  { id: "3", type: "attraction", name: "Heritage Museum", tags: ["culture", "history", "art"] },
  { id: "4", type: "attraction", name: "Central Park", tags: ["nature", "outdoor", "family"] },
  { id: "5", type: "attraction", name: "Old Town Walking Tour", tags: ["culture", "history", "walking"] },
  { id: "6", type: "event", name: "Jazz Night at Blue Note", tags: ["music", "nightlife", "entertainment"] },
  { id: "7", type: "event", name: "Food Festival 2024", tags: ["food", "local", "festival"] },
  { id: "8", type: "emergency", name: "City General Hospital", tags: ["medical", "emergency"] },
  { id: "9", type: "emergency", name: "Central Police Station", tags: ["police", "emergency"] },
  { id: "10", type: "emergency", name: "Tourist Embassy Office", tags: ["embassy", "help"] },
  { id: "11", type: "restaurant", name: "Mountain View Cafe", tags: ["food", "nature", "breakfast"] },
  { id: "12", type: "attraction", name: "Adventure Sports Center", tags: ["adventure", "outdoor", "sports"] },
]

// Filter places based on user interests
export function getRecommendedPlaces(interests: string[]): Place[] {
  if (!interests.length) return mockPlaces.filter((p) => p.type !== "emergency")

  const interestSet = new Set(interests.map((i) => i.toLowerCase().trim()))

  return mockPlaces
    .filter((place) => {
      if (place.type === "emergency") return false
      return place.tags.some(
        (tag) =>
          interestSet.has(tag) ||
          Array.from(interestSet).some((interest) => tag.includes(interest) || interest.includes(tag)),
      )
    })
    .slice(0, 6)
}

export function getEmergencyPlaces(): Place[] {
  return mockPlaces.filter((p) => p.type === "emergency")
}

// Generate confirmation ID
export function generateConfirmationId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "CONF-"
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function getMockWeather(destination: string): { temp: number; condition: string; description: string } {
  const conditions = [
    { condition: "Sunny", description: "Perfect day for sightseeing", icon: "sun" },
    { condition: "Partly Cloudy", description: "Nice weather for outdoor activities", icon: "cloud-sun" },
    { condition: "Cloudy", description: "Great for museum visits", icon: "cloud" },
    { condition: "Rainy", description: "Pack an umbrella", icon: "cloud-rain" },
    { condition: "Clear", description: "Beautiful clear skies", icon: "sun" },
  ]
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
  const temp = Math.floor(15 + Math.random() * 20)

  return {
    temp,
    condition: randomCondition.condition,
    description: randomCondition.description,
  }
}

export function convertCurrency(amount: number, from: string, to: string): number {
  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.12,
    JPY: 149.5,
    AUD: 1.53,
    CAD: 1.36,
    CHF: 0.88,
    CNY: 7.24,
    SGD: 1.34,
  }

  const fromRate = rates[from] || 1
  const toRate = rates[to] || 1

  return (amount / fromRate) * toRate
}

export const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CHF", "CNY", "SGD"]
