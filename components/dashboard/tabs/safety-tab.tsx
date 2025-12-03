"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { getEmergencyPlaces } from "@/lib/mock-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Plus, Trash2, Phone, MapPin, Share2, Copy, Check, Building } from "lucide-react"
import type { Place } from "@/lib/types"

export function SafetyTab() {
  const { user, addEmergencyContact, removeEmergencyContact } = useAuth()
  const [emergencyPlaces, setEmergencyPlaces] = useState<Place[]>([])

  // Form state
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")

  // Location sharing
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationLink, setLocationLink] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setEmergencyPlaces(getEmergencyPlaces())

    // Get location for sharing
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLocation(loc)
          setLocationLink(`https://maps.google.com/?q=${loc.lat},${loc.lng}`)
        },
        () => {
          // Silently fail - location sharing just won't be available
        },
      )
    }
  }, [])

  const handleAddContact = () => {
    if (!contactName || !contactPhone) return
    addEmergencyContact({ name: contactName, phone: contactPhone })
    setContactName("")
    setContactPhone("")
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(locationLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Safety & Emergency</h1>
        <p className="text-muted-foreground">Emergency contacts, location sharing, and nearby safety points</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>People to contact in case of emergency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Contact Form */}
            <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input placeholder="e.g., Mom" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="e.g., +1 234 567 8900"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAddContact} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>

            {/* Contact List */}
            {!user?.emergencyContacts || user.emergencyContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Phone className="h-10 w-10 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">No emergency contacts added</p>
              </div>
            ) : (
              <div className="space-y-2">
                {user.emergencyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeEmergencyContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Location Share */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Share Your Location
            </CardTitle>
            <CardDescription>Send your current location to family or friends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {location ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-success/10 p-2">
                    <MapPin className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Location available</p>
                    <p className="text-sm text-muted-foreground">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Shareable Link</Label>
                  <div className="flex gap-2">
                    <Textarea readOnly value={locationLink} className="resize-none h-20 font-mono text-sm" />
                  </div>
                  <Button onClick={handleCopyLink} variant="outline" className="w-full bg-transparent">
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-success" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Copy this link and send it via SMS, WhatsApp, or email
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">Location not available</p>
                <p className="text-xs text-muted-foreground">Enable location services to share your position</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Nearby Safety Points */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            Nearby Safety Points
          </CardTitle>
          <CardDescription>Important emergency locations near you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {emergencyPlaces.map((place) => (
              <div key={place.id} className="flex items-start gap-3 rounded-lg border border-border p-4">
                <div className="rounded-lg bg-destructive/10 p-2">
                  <Building className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{place.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{place.tags.join(" • ")}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
