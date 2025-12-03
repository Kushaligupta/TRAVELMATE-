"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useAppData } from "@/context/app-data-context"
import { useSettings } from "@/context/settings-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthModal } from "@/components/auth-modal"
import { NotificationsPopover } from "@/components/notifications-popover"
import { SettingsPopover } from "@/components/settings-popover"
import { Plane, LogOut, Menu, X } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const { unreadAlertCount } = useAppData()
  const { t } = useSettings()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                TravelMate<span className="text-primary">+</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <NotificationsPopover />

                  <SettingsPopover />

                  <div className="flex items-center gap-3 ml-2">
                    <Avatar className="h-8 w-8">
                      {user.avatar && <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />}
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <SettingsPopover />
                  <Button onClick={() => setShowAuthModal(true)}>{t("login")}</Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {user && <NotificationsPopover />}
              <SettingsPopover />
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="border-t border-border py-4 md:hidden">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-10 w-10">
                      {user.avatar && <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />}
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowAuthModal(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  {t("login")}
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}
