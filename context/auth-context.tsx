"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User, UserPreferences, EmergencyContact } from "@/lib/types"
import { getUsers, saveUsers, getCurrentUser, setCurrentUser } from "@/lib/storage"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  updatePreferences: (preferences: UserPreferences) => void
  addEmergencyContact: (contact: Omit<EmergencyContact, "id">) => void
  removeEmergencyContact: (id: string) => void
  updateAvatar: (base64: string) => void // Added avatar update
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const users = getUsers()
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!foundUser) {
      return { success: false, error: "No account found with this email" }
    }

    setUser(foundUser)
    setCurrentUser(foundUser)
    return { success: true }
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const users = getUsers()

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists" }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      preferences: {
        homeAirport: "",
        budgetLevel: "medium",
        interests: [],
      },
      emergencyContacts: [],
      travelHistory: [],
      createdAt: new Date().toISOString(),
    }

    const updatedUsers = [...users, newUser]
    saveUsers(updatedUsers)
    setUser(newUser)
    setCurrentUser(newUser)

    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setCurrentUser(null)
  }, [])

  const updateProfile = useCallback(
    (updates: Partial<User>) => {
      if (!user) return

      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      setCurrentUser(updatedUser)

      const users = getUsers()
      const userIndex = users.findIndex((u) => u.id === user.id)
      if (userIndex >= 0) {
        users[userIndex] = updatedUser
        saveUsers(users)
      }
    },
    [user],
  )

  const updatePreferences = useCallback(
    (preferences: UserPreferences) => {
      updateProfile({ preferences })
    },
    [updateProfile],
  )

  const addEmergencyContact = useCallback(
    (contact: Omit<EmergencyContact, "id">) => {
      if (!user) return

      const newContact: EmergencyContact = {
        ...contact,
        id: `contact-${Date.now()}`,
      }

      updateProfile({
        emergencyContacts: [...user.emergencyContacts, newContact],
      })
    },
    [user, updateProfile],
  )

  const removeEmergencyContact = useCallback(
    (id: string) => {
      if (!user) return

      updateProfile({
        emergencyContacts: user.emergencyContacts.filter((c) => c.id !== id),
      })
    },
    [user, updateProfile],
  )

  const updateAvatar = useCallback(
    (base64: string) => {
      updateProfile({ avatar: base64 })
    },
    [updateProfile],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        updatePreferences,
        addEmergencyContact,
        removeEmergencyContact,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
