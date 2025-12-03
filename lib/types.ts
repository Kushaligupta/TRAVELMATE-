// User & Auth Types
export interface UserPreferences {
  homeAirport: string
  budgetLevel: "low" | "medium" | "high"
  interests: string[]
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
}

export interface TripSummary {
  id: string
  destination: string
  startDate: string
  endDate: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string // base64 avatar image
  preferences: UserPreferences
  emergencyContacts: EmergencyContact[]
  travelHistory: TripSummary[]
  createdAt: string
}

export interface TripNote {
  id: string
  date: string
  content: string
  checklist: ChecklistItem[]
  links: string[]
}

export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

// Itinerary Types
export type SegmentType = "transport" | "stay" | "activity"
export type SegmentStatus = "on-time" | "delayed" | "canceled"

export interface Segment {
  id: string
  type: SegmentType
  title: string
  time: string
  status: SegmentStatus
  day?: number // Added day field for day-wise breakdown
}

export interface Trip {
  id: string
  destination: string
  startDate: string
  endDate: string
  segments: Segment[]
  isFavorite?: boolean
  notes?: TripNote[]
}

// Booking Types
export type BookingMode = "flight" | "train" | "bus" | "hotel" | "cab"

export interface BookingResult {
  id: string
  mode: BookingMode
  provider: string
  price: number
  details: string
  rating?: number
  duration?: string
}

export interface Booking {
  id: string
  confirmationId: string
  mode: BookingMode
  details: string
  price: number
  createdAt: string
  isFavorite?: boolean // Added favorite field
}

// Expense Types
export type ExpenseCategory = "transport" | "stay" | "food" | "activities" | "other"

export interface Expense {
  id: string
  description: string
  amount: number
  category: ExpenseCategory
  groupMembers: string[]
  paidBy: string
  createdAt: string
  groupId?: string
}

// Alert Types
export type AlertType = "flight" | "weather" | "traffic" | "emergency"

export interface Alert {
  id: string
  type: AlertType
  message: string
  createdAt: string
  read?: boolean
}

// Location Types
export type PlaceType = "restaurant" | "attraction" | "event" | "emergency"

export interface Place {
  id: string
  type: PlaceType
  name: string
  tags: string[]
  distance?: string
}

// Offline Types
export interface OfflineItem {
  id: string
  type: "itinerary" | "ticket"
  label: string
  data: Trip | Booking
  savedAt: string
}

export interface FavoriteDestination {
  id: string
  name: string
  country?: string
  addedAt: string
}

export interface TravelGroup {
  id: string
  name: string
  members: string[]
  createdAt: string
}

export interface AppSettings {
  theme: "light" | "dark" | "system"
  language: "en" | "hi"
}
