import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Event } from "@/app/components/EventCard";
import { Search, Loader2, Calendar } from "lucide-react";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventAdd: (event: Event) => void;
}

interface ParsedEventData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: Event["type"];
  description?: string;
  color: string;
  imageUrl?: string;
}

// Mock function to simulate parsing URL for event data
const parseEventFromUrl = async (url: string): Promise<ParsedEventData | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock parsing logic - in real app, this would call an API
  if (url.includes("meetup.com")) {
    return {
      title: "React Meetup",
      date: "2026-02-15",
      startTime: "18:00",
      endTime: "20:00",
      location: "Tech Hub Downtown",
      type: "conference",
      description: "Monthly React developers meetup to discuss best practices and new features.",
      color: "#a855f7",
    };
  } else if (url.includes("zoom.us") || url.includes("teams.microsoft.com")) {
    return {
      title: "Virtual Team Meeting",
      date: "2026-02-10",
      startTime: "10:00",
      endTime: "11:00",
      location: "Virtual Meeting",
      type: "meeting",
      description: "Weekly team sync-up meeting.",
      color: "#3b82f6",
    };
  } else if (url.includes("eventbrite.com")) {
    return {
      title: "Web Design Conference 2026",
      date: "2026-03-20",
      startTime: "09:00",
      endTime: "17:00",
      location: "Convention Center",
      type: "conference",
      description: "Annual web design and development conference.",
      color: "#a855f7",
    };
  } else if (url.includes("calendar.google.com")) {
    return {
      title: "Project Review",
      date: "2026-02-12",
      startTime: "14:00",
      endTime: "15:00",
      location: "Conference Room B",
      type: "meeting",
      description: "Quarterly project review with stakeholders.",
      color: "#3b82f6",
    };
  }

  return null;
};

const eventTypeColors: Record<Event["type"], string> = {
  meeting: "#3b82f6",
  conference: "#a855f7",
  birthday: "#ec4899",
  reminder: "#eab308",
  other: "#6b7280",
};

export function AddEventDialog({ open, onOpenChange, onEventAdd }: AddEventDialogProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState<ParsedEventData>({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "other",
    color: eventTypeColors.other,
  });
  const [error, setError] = useState<string | null>(null);

  const handleUrlParse = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Redirect to the event registration page
      window.open(url, '_blank');
      
      const parsed = await parseEventFromUrl(url);
      if (parsed) {
        setEventData(parsed);
        setError(null);
      } else {
        setError("Could not extract event information from this URL. Please fill in the details manually.");
      }
    } catch (err) {
      setError("Failed to parse URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert 24-hour format to 12-hour format with AM/PM
    const formatTime = (time24: string) => {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: eventData.title,
      date: new Date(eventData.date),
      startTime: formatTime(eventData.startTime),
      endTime: formatTime(eventData.endTime),
      location: eventData.location,
      type: eventData.type,
      description: eventData.description,
      color: eventData.color,
      imageUrl: eventData.imageUrl,
    };

    onEventAdd(newEvent);
    handleClose();
  };

  const handleClose = () => {
    setUrl("");
    setEventData({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      type: "other",
      color: eventTypeColors.other,
      imageUrl: "",
    });
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Paste an event URL to automatically extract details, or fill in manually.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">Event URL (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/event"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUrlParse();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={handleUrlParse}
                disabled={isLoading || !url.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Search className="size-4" />
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Paste event URL to auto-fill details, or fill manually below
            </p>
          </div>

          {/* Event Form */}
          <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={eventData.title}
                  onChange={(e) =>
                    setEventData({ ...eventData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={eventData.date}
                    onChange={(e) =>
                      setEventData({ ...eventData, date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={eventData.type}
                    onValueChange={(value: Event["type"]) =>
                      setEventData({
                        ...eventData,
                        type: value,
                        color: eventTypeColors[value],
                      })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={eventData.startTime}
                    onChange={(e) =>
                      setEventData({ ...eventData, startTime: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={eventData.endTime}
                    onChange={(e) =>
                      setEventData({ ...eventData, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={eventData.location || ""}
                  onChange={(e) =>
                    setEventData({ ...eventData, location: e.target.value })
                  }
                  placeholder="Conference Room or Virtual"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={eventData.description || ""}
                  onChange={(e) =>
                    setEventData({ ...eventData, description: e.target.value })
                  }
                  placeholder="Add event details..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Event Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={eventData.imageUrl || ""}
                  onChange={(e) =>
                    setEventData({ ...eventData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/event-image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Right-click the event image on the event page and select "Copy image address"
                </p>
              </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                <Calendar className="size-4 mr-2" />
                Add Event
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
