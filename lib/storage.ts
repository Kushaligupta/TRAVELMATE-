import type {
  User,
  Trip,
  Booking,
  Expense,
  Alert,
  OfflineItem,
  FavoriteDestination,
  TravelGroup,
  AppSettings,
} from "./types"

const STORAGE_KEYS = {
  USERS: "travelmate_users",
  CURRENT_USER: "travelmate_current_user",
  TRIPS: "travelmate_trips",
  BOOKINGS: "travelmate_bookings",
  EXPENSES: "travelmate_expenses",
  ALERTS: "travelmate_alerts",
  OFFLINE: "travelmate_offline",
  FAVORITES: "travelmate_favorites", // Added favorites key
  GROUPS: "travelmate_groups", // Added groups key
  SETTINGS: "travelmate_settings", // Added settings key
}

// Helper to safely parse JSON from localStorage
function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

// Users
export function getUsers(): User[] {
  return safeGet<User[]>(STORAGE_KEYS.USERS, [])
}

export function saveUsers(users: User[]): void {
  safeSet(STORAGE_KEYS.USERS, users)
}

export function getCurrentUser(): User | null {
  return safeGet<User | null>(STORAGE_KEYS.CURRENT_USER, null)
}

export function setCurrentUser(user: User | null): void {
  safeSet(STORAGE_KEYS.CURRENT_USER, user)
}

// Trips
export function getTrips(): Trip[] {
  return safeGet<Trip[]>(STORAGE_KEYS.TRIPS, [])
}

export function saveTrips(trips: Trip[]): void {
  safeSet(STORAGE_KEYS.TRIPS, trips)
}

// Bookings
export function getBookings(): Booking[] {
  return safeGet<Booking[]>(STORAGE_KEYS.BOOKINGS, [])
}

export function saveBookings(bookings: Booking[]): void {
  safeSet(STORAGE_KEYS.BOOKINGS, bookings)
}

// Expenses
export function getExpenses(): Expense[] {
  return safeGet<Expense[]>(STORAGE_KEYS.EXPENSES, [])
}

export function saveExpenses(expenses: Expense[]): void {
  safeSet(STORAGE_KEYS.EXPENSES, expenses)
}

// Alerts
export function getAlerts(): Alert[] {
  return safeGet<Alert[]>(STORAGE_KEYS.ALERTS, [])
}

export function saveAlerts(alerts: Alert[]): void {
  safeSet(STORAGE_KEYS.ALERTS, alerts)
}

// Offline Items
export function getOfflineItems(): OfflineItem[] {
  return safeGet<OfflineItem[]>(STORAGE_KEYS.OFFLINE, [])
}

export function saveOfflineItems(items: OfflineItem[]): void {
  safeSet(STORAGE_KEYS.OFFLINE, items)
}

export function getFavorites(): FavoriteDestination[] {
  return safeGet<FavoriteDestination[]>(STORAGE_KEYS.FAVORITES, [])
}

export function saveFavorites(favorites: FavoriteDestination[]): void {
  safeSet(STORAGE_KEYS.FAVORITES, favorites)
}

export function getGroups(): TravelGroup[] {
  return safeGet<TravelGroup[]>(STORAGE_KEYS.GROUPS, [])
}

export function saveGroups(groups: TravelGroup[]): void {
  safeSet(STORAGE_KEYS.GROUPS, groups)
}

export function getSettings(): AppSettings {
  return safeGet<AppSettings>(STORAGE_KEYS.SETTINGS, { theme: "system", language: "en" })
}

export function saveSettings(settings: AppSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, settings)
}
