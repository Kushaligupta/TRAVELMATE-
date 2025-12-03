"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { AppSettings } from "@/lib/types"
import { getSettings, saveSettings } from "@/lib/storage"
import { translations, type TranslationKey } from "@/lib/translations"

interface SettingsContextType {
  settings: AppSettings
  setTheme: (theme: AppSettings["theme"]) => void
  setLanguage: (language: AppSettings["language"]) => void
  t: (key: TranslationKey) => string
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({ theme: "system", language: "en" })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setSettings(getSettings())
    setMounted(true)
  }, [])

  // Apply theme
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (settings.theme === "dark" || (settings.theme === "system" && systemDark)) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [settings.theme, mounted])

  const setTheme = useCallback(
    (theme: AppSettings["theme"]) => {
      const updated = { ...settings, theme }
      setSettings(updated)
      saveSettings(updated)
    },
    [settings],
  )

  const setLanguage = useCallback(
    (language: AppSettings["language"]) => {
      const updated = { ...settings, language }
      setSettings(updated)
      saveSettings(updated)
    },
    [settings],
  )

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[settings.language]?.[key] || translations.en[key] || key
    },
    [settings.language],
  )

  return <SettingsContext.Provider value={{ settings, setTheme, setLanguage, t }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
