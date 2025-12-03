"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Save, Loader2, Camera } from "lucide-react"
import type { UserPreferences } from "@/lib/types"

export function ProfileCard() {
  const { user, updatePreferences, updateAvatar } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<UserPreferences>(
    user?.preferences || {
      homeAirport: "",
      budgetLevel: "medium",
      interests: [],
    },
  )

  useEffect(() => {
    if (user?.preferences) {
      setFormData(user.preferences)
    }
  }, [user?.preferences])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    updatePreferences(formData)
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      updateAvatar(base64)
    }
    reader.readAsDataURL(file)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Profile & Preferences
        </CardTitle>
        <CardDescription>Personalize your travel experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              {user.avatar && <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />}
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-3 w-3" />
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="homeAirport">Home Airport / City</Label>
            <Input
              id="homeAirport"
              placeholder="e.g., New York (JFK)"
              value={formData.homeAirport}
              onChange={(e) => setFormData({ ...formData, homeAirport: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetLevel">Budget Level</Label>
            <Select
              value={formData.budgetLevel}
              onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, budgetLevel: value })}
              disabled={!isEditing}
            >
              <SelectTrigger id="budgetLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Budget-Friendly</SelectItem>
                <SelectItem value="medium">Moderate</SelectItem>
                <SelectItem value="high">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input
              id="interests"
              placeholder="e.g., nature, food, culture, adventure"
              value={formData.interests.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  interests: e.target.value
                    .split(",")
                    .map((i) => i.trim())
                    .filter(Boolean),
                })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Preferences
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
