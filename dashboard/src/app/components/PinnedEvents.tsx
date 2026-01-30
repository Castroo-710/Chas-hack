import { Event } from "@/app/components/EventCard";
import { Calendar, Clock, MapPin, Pin } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface PinnedEventsProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function PinnedEvents({ events, onEventClick }: PinnedEventsProps) {
  const pinnedEvents = events.filter((event) => event.pinned);

  if (pinnedEvents.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="pb-4 border-b h-[60px] flex items-end">
          <div className="flex items-center gap-2 w-full">
            <Pin className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">Pinned Events</h2>
          </div>
        </div>
        <div className="pt-6">
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <Pin className="size-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No pinned events yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click the pin icon on any event to save it here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="pb-4 border-b h-[60px] flex items-end">
        <div className="flex items-center gap-2 w-full">
          <Pin className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">Pinned Events</h2>
          <Badge variant="secondary" className="ml-auto">
            {pinnedEvents.length}
          </Badge>
        </div>
      </div>
      <div className="pt-6">
        <div className="space-y-3">
          {pinnedEvents.map((event) => (
            <Card
              key={event.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 relative"
              style={{ borderLeftColor: event.color }}
              onClick={() => onEventClick(event)}
            >
              <Pin className="size-4 text-primary absolute top-3 right-3" fill="currentColor" />
              <div className="pr-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-sm truncate">{event.title}</h3>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3 flex-shrink-0" />
                    <span>
                      {event.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3 flex-shrink-0" />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}