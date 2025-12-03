"use client"

import { useState } from "react"
import { useAppData } from "@/context/app-data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  MapPin,
  Calendar,
  Plane,
  Hotel,
  Activity,
  Clock,
  Trash2,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Heart,
  StickyNote,
  CheckSquare,
  Link,
  Map,
} from "lucide-react"
import type { Trip, SegmentType, SegmentStatus, ChecklistItem } from "@/lib/types"
import { WeatherWidget } from "@/components/weather-widget"

const segmentIcons: Record<SegmentType, typeof Plane> = {
  transport: Plane,
  stay: Hotel,
  activity: Activity,
}

const statusConfig: Record<SegmentStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  "on-time": { label: "On Time", color: "bg-success/10 text-success", icon: CheckCircle },
  delayed: { label: "Delayed", color: "bg-warning/10 text-warning", icon: AlertTriangle },
  canceled: { label: "Canceled", color: "bg-destructive/10 text-destructive", icon: XCircle },
}

export function ItineraryTab() {
  const {
    trips,
    addTrip,
    removeTrip,
    addSegment,
    updateSegmentStatus,
    removeSegment,
    toggleTripFavorite,
    addTripNote,
    removeTripNote,
    toggleChecklistItem,
  } = useAppData()
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [showNotes, setShowNotes] = useState(false)

  // Trip form
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Segment form
  const [segmentType, setSegmentType] = useState<SegmentType>("transport")
  const [segmentTitle, setSegmentTitle] = useState("")
  const [segmentTime, setSegmentTime] = useState("")
  const [segmentDay, setSegmentDay] = useState<string>("1")

  // Note form
  const [noteContent, setNoteContent] = useState("")
  const [noteDate, setNoteDate] = useState("")
  const [checklistItems, setChecklistItems] = useState("")
  const [noteLinks, setNoteLinks] = useState("")

  const handleAddTrip = () => {
    if (!destination || !startDate || !endDate) return
    const newTrip = addTrip({ destination, startDate, endDate })
    setSelectedTrip(newTrip)
    setDestination("")
    setStartDate("")
    setEndDate("")
  }

  const handleAddSegment = () => {
    if (!selectedTrip || !segmentTitle || !segmentTime) return
    addSegment(selectedTrip.id, {
      type: segmentType,
      title: segmentTitle,
      time: segmentTime,
      status: "on-time",
      day: Number.parseInt(segmentDay),
    })
    setSegmentTitle("")
    setSegmentTime("")
  }

  const handleAddNote = () => {
    if (!selectedTrip || !noteContent) return
    const checklist: ChecklistItem[] = checklistItems
      .split("\n")
      .filter(Boolean)
      .map((text, i) => ({
        id: `item-${Date.now()}-${i}`,
        text: text.trim(),
        checked: false,
      }))
    const links = noteLinks
      .split("\n")
      .filter(Boolean)
      .map((l) => l.trim())

    addTripNote(selectedTrip.id, {
      date: noteDate || new Date().toISOString().split("T")[0],
      content: noteContent,
      checklist,
      links,
    })
    setNoteContent("")
    setNoteDate("")
    setChecklistItems("")
    setNoteLinks("")
  }

  // Update selectedTrip when trips change
  const currentTrip = selectedTrip ? trips.find((t) => t.id === selectedTrip.id) : null

  // Calculate trip days
  const getTripDays = (trip: Trip) => {
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return Array.from({ length: days }, (_, i) => i + 1)
  }

  // Group segments by day
  const getSegmentsByDay = (trip: Trip) => {
    const days = getTripDays(trip)
    return days.map((day) => ({
      day,
      segments: trip.segments.filter((s) => s.day === day || (!s.day && day === 1)),
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Smart Itinerary Planner</h1>
        <p className="text-muted-foreground">Plan your trips with transport, accommodation, and activities</p>
      </div>

      {/* Add Trip Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Paris, France"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <Button onClick={handleAddTrip}>
              <Plus className="mr-2 h-4 w-4" />
              Add Trip
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trip List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Your Trips
            </CardTitle>
            <CardDescription>Select a trip to view and edit details</CardDescription>
          </CardHeader>
          <CardContent>
            {trips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">No trips yet. Add your first trip above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors ${
                      currentTrip?.id === trip.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{trip.destination}</p>
                        {trip.isFavorite && <Heart className="h-4 w-4 text-destructive fill-destructive" />}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{trip.segments.length} segments</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTripFavorite(trip.id)
                        }}
                      >
                        <Heart
                          className={`h-4 w-4 ${trip.isFavorite ? "text-destructive fill-destructive" : "text-muted-foreground"}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (currentTrip?.id === trip.id) setSelectedTrip(null)
                          removeTrip(trip.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{currentTrip ? currentTrip.destination : "Trip Details"}</CardTitle>
                <CardDescription>
                  {currentTrip
                    ? `${new Date(currentTrip.startDate).toLocaleDateString()} - ${new Date(currentTrip.endDate).toLocaleDateString()}`
                    : "Select a trip to see details"}
                </CardDescription>
              </div>
              {currentTrip && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(`https://maps.google.com/?q=${encodeURIComponent(currentTrip.destination)}`, "_blank")
                    }
                  >
                    <Map className="mr-2 h-4 w-4" />
                    Map
                  </Button>
                  <Button
                    variant={showNotes ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowNotes(!showNotes)}
                  >
                    <StickyNote className="mr-2 h-4 w-4" />
                    Notes
                  </Button>
                </div>
              )}
            </div>
            {currentTrip && (
              <div className="mt-3">
                <WeatherWidget destination={currentTrip.destination} compact />
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!currentTrip ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Select a trip from the list to view and edit segments
                </p>
              </div>
            ) : showNotes ? (
              <div className="space-y-4">
                {/* Add Note Form */}
                <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">Add Note</p>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={noteDate}
                      onChange={(e) => setNoteDate(e.target.value)}
                      placeholder="Date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Write your notes here..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Checklist (one item per line)</Label>
                    <Textarea
                      placeholder="Pack passport&#10;Book airport transfer&#10;Confirm hotel"
                      value={checklistItems}
                      onChange={(e) => setChecklistItems(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Links (one per line)</Label>
                    <Input placeholder="https://..." value={noteLinks} onChange={(e) => setNoteLinks(e.target.value)} />
                  </div>
                  <Button onClick={handleAddNote} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                </div>

                {/* Notes List */}
                {(currentTrip.notes || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No notes yet</p>
                ) : (
                  <div className="space-y-3">
                    {(currentTrip.notes || []).map((note) => (
                      <div key={note.id} className="rounded-lg border border-border p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{new Date(note.date).toLocaleDateString()}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeTripNote(currentTrip.id, note.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-foreground">{note.content}</p>
                        {note.checklist.length > 0 && (
                          <div className="space-y-1">
                            {note.checklist.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                                onClick={() => toggleChecklistItem(currentTrip.id, note.id, item.id)}
                              >
                                <CheckSquare
                                  className={`h-4 w-4 ${item.checked ? "text-success" : "text-muted-foreground"}`}
                                />
                                <span className={item.checked ? "line-through text-muted-foreground" : ""}>
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {note.links.length > 0 && (
                          <div className="space-y-1">
                            {note.links.map((link, i) => (
                              <a
                                key={i}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <Link className="h-3 w-3" />
                                {link}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Add Segment Form */}
                <div className="rounded-lg border border-dashed border-border p-4 space-y-4">
                  <p className="text-sm font-medium text-foreground">Add Segment</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={segmentType} onValueChange={(v) => setSegmentType(v as SegmentType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="stay">Stay</SelectItem>
                          <SelectItem value="activity">Activity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Day</Label>
                      <Select value={segmentDay} onValueChange={setSegmentDay}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getTripDays(currentTrip).map((day) => (
                            <SelectItem key={day} value={day.toString()}>
                              Day {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={segmentTime}
                        onChange={(e) => setSegmentTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="e.g., Flight DEL → GOI"
                      value={segmentTitle}
                      onChange={(e) => setSegmentTitle(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddSegment} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Segment
                  </Button>
                </div>

                {currentTrip.segments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No segments yet. Add transport, stays, or activities above.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {getSegmentsByDay(currentTrip).map(({ day, segments }) => (
                      <div key={day} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Day {day}</Badge>
                          <div className="flex-1 border-t border-border" />
                        </div>
                        {segments.length === 0 ? (
                          <p className="text-xs text-muted-foreground pl-4">No activities planned</p>
                        ) : (
                          <div className="space-y-2 pl-4 border-l-2 border-border ml-3">
                            {segments.map((segment) => {
                              const Icon = segmentIcons[segment.type]
                              const status = statusConfig[segment.status]
                              const StatusIcon = status.icon

                              return (
                                <div
                                  key={segment.id}
                                  className="flex items-start gap-3 rounded-lg border border-border p-3 ml-2"
                                >
                                  <div className="rounded-lg bg-secondary p-2">
                                    <Icon className="h-4 w-4 text-secondary-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-foreground truncate">{segment.title}</p>
                                      <Badge className={status.color} variant="secondary">
                                        <StatusIcon className="mr-1 h-3 w-3" />
                                        {status.label}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      {new Date(segment.time).toLocaleString()}
                                    </p>
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                      {segment.status !== "on-time" && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 text-xs"
                                          onClick={() => updateSegmentStatus(currentTrip.id, segment.id, "on-time")}
                                        >
                                          Mark On-Time
                                        </Button>
                                      )}
                                      {segment.status !== "delayed" && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 text-xs text-warning"
                                          onClick={() => updateSegmentStatus(currentTrip.id, segment.id, "delayed")}
                                        >
                                          Mark Delayed
                                        </Button>
                                      )}
                                      {segment.status !== "canceled" && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 text-xs text-destructive"
                                          onClick={() => updateSegmentStatus(currentTrip.id, segment.id, "canceled")}
                                        >
                                          Mark Canceled
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive"
                                        onClick={() => removeSegment(currentTrip.id, segment.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
