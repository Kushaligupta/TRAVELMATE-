"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type {
  Trip,
  Segment,
  Booking,
  Expense,
  Alert,
  OfflineItem,
  BookingResult,
  FavoriteDestination,
  TravelGroup,
  TripNote,
} from "@/lib/types"
import {
  getTrips,
  saveTrips,
  getBookings,
  saveBookings,
  getExpenses,
  saveExpenses,
  getAlerts,
  saveAlerts,
  getOfflineItems,
  saveOfflineItems,
  getFavorites,
  saveFavorites,
  getGroups,
  saveGroups,
} from "@/lib/storage"
import { generateConfirmationId } from "@/lib/mock-api"

interface AppDataContextType {
  // Trips
  trips: Trip[]
  addTrip: (trip: Omit<Trip, "id" | "segments">) => Trip
  removeTrip: (id: string) => void
  addSegment: (tripId: string, segment: Omit<Segment, "id">) => void
  updateSegmentStatus: (tripId: string, segmentId: string, status: Segment["status"]) => void
  removeSegment: (tripId: string, segmentId: string) => void
  toggleTripFavorite: (tripId: string) => void // Added
  addTripNote: (tripId: string, note: Omit<TripNote, "id">) => void // Added
  updateTripNote: (tripId: string, noteId: string, updates: Partial<TripNote>) => void // Added
  removeTripNote: (tripId: string, noteId: string) => void // Added
  toggleChecklistItem: (tripId: string, noteId: string, itemId: string) => void // Added

  // Bookings
  bookings: Booking[]
  addBooking: (result: BookingResult) => Booking
  removeBooking: (id: string) => void
  toggleBookingFavorite: (id: string) => void // Added

  // Expenses
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, "id" | "createdAt">) => void
  removeExpense: (id: string) => void

  // Alerts
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, "id" | "createdAt">) => void
  dismissAlert: (id: string) => void
  markAlertRead: (id: string) => void // Added
  unreadAlertCount: number // Added

  // Offline
  offlineItems: OfflineItem[]
  saveForOffline: (type: "itinerary" | "ticket", data: Trip | Booking) => void
  removeOfflineItem: (id: string) => void
  exportAllData: () => string // Added
  importData: (jsonData: string) => boolean // Added

  // Favorites Added
  favorites: FavoriteDestination[]
  addFavorite: (destination: Omit<FavoriteDestination, "id" | "addedAt">) => void
  removeFavorite: (id: string) => void

  // Groups Added
  groups: TravelGroup[]
  addGroup: (group: Omit<TravelGroup, "id" | "createdAt">) => void
  removeGroup: (id: string) => void
  addMemberToGroup: (groupId: string, member: string) => void
  removeMemberFromGroup: (groupId: string, member: string) => void
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>([])
  const [favorites, setFavorites] = useState<FavoriteDestination[]>([])
  const [groups, setGroups] = useState<TravelGroup[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    setTrips(getTrips())
    setBookings(getBookings())
    setExpenses(getExpenses())
    setAlerts(getAlerts())
    setOfflineItems(getOfflineItems())
    setFavorites(getFavorites())
    setGroups(getGroups())
  }, [])

  // Trips
  const addTrip = useCallback(
    (tripData: Omit<Trip, "id" | "segments">): Trip => {
      const newTrip: Trip = {
        ...tripData,
        id: `trip-${Date.now()}`,
        segments: [],
        notes: [],
      }
      const updated = [...trips, newTrip]
      setTrips(updated)
      saveTrips(updated)
      return newTrip
    },
    [trips],
  )

  const removeTrip = useCallback(
    (id: string) => {
      const updated = trips.filter((t) => t.id !== id)
      setTrips(updated)
      saveTrips(updated)
    },
    [trips],
  )

  const addSegment = useCallback(
    (tripId: string, segmentData: Omit<Segment, "id">) => {
      const updated = trips.map((trip) => {
        if (trip.id !== tripId) return trip
        const newSegment: Segment = {
          ...segmentData,
          id: `seg-${Date.now()}`,
        }
        return {
          ...trip,
          segments: [...trip.segments, newSegment].sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
          ),
        }
      })
      setTrips(updated)
      saveTrips(updated)
    },
    [trips],
  )

  const updateSegmentStatus = useCallback(
    (tripId: string, segmentId: string, status: Segment["status"]) => {
      const updated = trips.map((trip) => {
        if (trip.id !== tripId) return trip
        return {
          ...trip,
          segments: trip.segments.map((seg) => (seg.id === segmentId ? { ...seg, status } : seg)),
        }
      })
      setTrips(updated)
      saveTrips(updated)
    },
    [trips],
  )

  const removeSegment = useCallback(
    (tripId: string, segmentId: string) => {
      const updated = trips.map((trip) => {
        if (trip.id !== tripId) return trip
        return {
          ...trip,
          segments: trip.segments.filter((seg) => seg.id !== segmentId),
        }
      })
      setTrips(updated)
      saveTrips(updated)
    },
    [trips],
  )

  const toggleTripFavorite = useCallback(
    (tripId: string) => {
      const updated = trips.map((trip) => {
        if (trip.id !== tripId) return trip
        return { ...trip, isFavorite: !trip.isFavorite }
      })
      setTrips(updated)
      saveTrips(updated)
    },
    [trips],
  )

  const addTripNote = useCallback(
    (tripId: string, noteData: Omit<TripNote, "id">) => {
      const updated = trips.map((trip) => {
        if (trip.id !== tripId) return trip
        const newNote: TripNote = {
          ...noteData,
          id: `note-${Date.now()}`,
        }
        return {
          ...trip,
          notes: [...(trip.notes || []), newNote],
        }
      })
      setTrips(updated)
      saveTrips(updated)
    },
    [trips],
  )

  const updateTripNote = useCallback(
    (tripId: string, noteId: string, updates: Partial<TripNote>) => {
      const updated = trips.map((trip) => {
        if (trip.id !== tripId) return trip
        return {
          ...trip,
          notes: (trip.notes || []).map((note) => (note.id === noteId ? { ...note, ...updates } : note)),
        }
      })
      setTrips(updated)
      saveTrips(updated)
    },
    [trips],
  )

  const removeTripNote = useCallback(
    (tripId: string, noteId: string) => {
      const updated = trips.map((trip) => {
        if (trip.id !== tripId) return trip
        return {
          ...trip,
          notes: (trip.notes || []).filter((note) => note.id !== noteId),
        }
      })
      setTrips(updated)
      saveTrips(updated)
    },
    [trips],
  )

  const toggleChecklistItem = useCallback(
    (tripId: string, noteId: string, itemId: string) => {
      const updated = trips.map((trip) => {
        if (trip.id !== tripId) return trip
        return {
          ...trip,
          notes: (trip.notes || []).map((note) => {
            if (note.id !== noteId) return note
            return {
              ...note,
              checklist: note.checklist.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item,
              ),
            }
          }),
        }
      })
      setTrips(updated)
      saveTrips(updated)
    },
    [trips],
  )

  // Bookings
  const addBooking = useCallback(
    (result: BookingResult): Booking => {
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        confirmationId: generateConfirmationId(),
        mode: result.mode,
        details: result.details,
        price: result.price,
        createdAt: new Date().toISOString(),
      }
      const updated = [...bookings, newBooking]
      setBookings(updated)
      saveBookings(updated)
      return newBooking
    },
    [bookings],
  )

  const removeBooking = useCallback(
    (id: string) => {
      const updated = bookings.filter((b) => b.id !== id)
      setBookings(updated)
      saveBookings(updated)
    },
    [bookings],
  )

  const toggleBookingFavorite = useCallback(
    (id: string) => {
      const updated = bookings.map((booking) =>
        booking.id === id ? { ...booking, isFavorite: !booking.isFavorite } : booking,
      )
      setBookings(updated)
      saveBookings(updated)
    },
    [bookings],
  )

  // Expenses
  const addExpense = useCallback(
    (expenseData: Omit<Expense, "id" | "createdAt">) => {
      const newExpense: Expense = {
        ...expenseData,
        id: `expense-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      const updated = [...expenses, newExpense]
      setExpenses(updated)
      saveExpenses(updated)
    },
    [expenses],
  )

  const removeExpense = useCallback(
    (id: string) => {
      const updated = expenses.filter((e) => e.id !== id)
      setExpenses(updated)
      saveExpenses(updated)
    },
    [expenses],
  )

  // Alerts
  const addAlert = useCallback(
    (alertData: Omit<Alert, "id" | "createdAt">) => {
      const newAlert: Alert = {
        ...alertData,
        id: `alert-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      }
      const updated = [newAlert, ...alerts]
      setAlerts(updated)
      saveAlerts(updated)
    },
    [alerts],
  )

  const dismissAlert = useCallback(
    (id: string) => {
      const updated = alerts.filter((a) => a.id !== id)
      setAlerts(updated)
      saveAlerts(updated)
    },
    [alerts],
  )

  const markAlertRead = useCallback(
    (id: string) => {
      const updated = alerts.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))
      setAlerts(updated)
      saveAlerts(updated)
    },
    [alerts],
  )

  const unreadAlertCount = alerts.filter((a) => !a.read).length

  // Offline
  const saveForOffline = useCallback(
    (type: "itinerary" | "ticket", data: Trip | Booking) => {
      const label =
        type === "itinerary"
          ? `Itinerary: ${(data as Trip).destination}`
          : `Ticket: ${(data as Booking).mode.toUpperCase()} ${(data as Booking).confirmationId}`

      const newItem: OfflineItem = {
        id: `offline-${Date.now()}`,
        type,
        label,
        data,
        savedAt: new Date().toISOString(),
      }
      const updated = [...offlineItems, newItem]
      setOfflineItems(updated)
      saveOfflineItems(updated)
    },
    [offlineItems],
  )

  const removeOfflineItem = useCallback(
    (id: string) => {
      const updated = offlineItems.filter((item) => item.id !== id)
      setOfflineItems(updated)
      saveOfflineItems(updated)
    },
    [offlineItems],
  )

  const exportAllData = useCallback(() => {
    const data = {
      trips,
      bookings,
      expenses,
      alerts,
      offlineItems,
      favorites,
      groups,
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }, [trips, bookings, expenses, alerts, offlineItems, favorites, groups])

  const importData = useCallback((jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData)
      if (data.trips) {
        setTrips(data.trips)
        saveTrips(data.trips)
      }
      if (data.bookings) {
        setBookings(data.bookings)
        saveBookings(data.bookings)
      }
      if (data.expenses) {
        setExpenses(data.expenses)
        saveExpenses(data.expenses)
      }
      if (data.alerts) {
        setAlerts(data.alerts)
        saveAlerts(data.alerts)
      }
      if (data.favorites) {
        setFavorites(data.favorites)
        saveFavorites(data.favorites)
      }
      if (data.groups) {
        setGroups(data.groups)
        saveGroups(data.groups)
      }
      return true
    } catch {
      return false
    }
  }, [])

  const addFavorite = useCallback(
    (destination: Omit<FavoriteDestination, "id" | "addedAt">) => {
      const newFavorite: FavoriteDestination = {
        ...destination,
        id: `fav-${Date.now()}`,
        addedAt: new Date().toISOString(),
      }
      const updated = [...favorites, newFavorite]
      setFavorites(updated)
      saveFavorites(updated)
    },
    [favorites],
  )

  const removeFavorite = useCallback(
    (id: string) => {
      const updated = favorites.filter((f) => f.id !== id)
      setFavorites(updated)
      saveFavorites(updated)
    },
    [favorites],
  )

  const addGroup = useCallback(
    (groupData: Omit<TravelGroup, "id" | "createdAt">) => {
      const newGroup: TravelGroup = {
        ...groupData,
        id: `group-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      const updated = [...groups, newGroup]
      setGroups(updated)
      saveGroups(updated)
    },
    [groups],
  )

  const removeGroup = useCallback(
    (id: string) => {
      const updated = groups.filter((g) => g.id !== id)
      setGroups(updated)
      saveGroups(updated)
    },
    [groups],
  )

  const addMemberToGroup = useCallback(
    (groupId: string, member: string) => {
      const updated = groups.map((group) => {
        if (group.id !== groupId) return group
        if (group.members.includes(member)) return group
        return { ...group, members: [...group.members, member] }
      })
      setGroups(updated)
      saveGroups(updated)
    },
    [groups],
  )

  const removeMemberFromGroup = useCallback(
    (groupId: string, member: string) => {
      const updated = groups.map((group) => {
        if (group.id !== groupId) return group
        return { ...group, members: group.members.filter((m) => m !== member) }
      })
      setGroups(updated)
      saveGroups(updated)
    },
    [groups],
  )

  return (
    <AppDataContext.Provider
      value={{
        trips,
        addTrip,
        removeTrip,
        addSegment,
        updateSegmentStatus,
        removeSegment,
        toggleTripFavorite,
        addTripNote,
        updateTripNote,
        removeTripNote,
        toggleChecklistItem,
        bookings,
        addBooking,
        removeBooking,
        toggleBookingFavorite,
        expenses,
        addExpense,
        removeExpense,
        alerts,
        addAlert,
        dismissAlert,
        markAlertRead,
        unreadAlertCount,
        offlineItems,
        saveForOffline,
        removeOfflineItem,
        exportAllData,
        importData,
        favorites,
        addFavorite,
        removeFavorite,
        groups,
        addGroup,
        removeGroup,
        addMemberToGroup,
        removeMemberFromGroup,
      }}
    >
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider")
  }
  return context
}
