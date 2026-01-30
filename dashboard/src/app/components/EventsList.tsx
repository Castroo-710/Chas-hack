import { EventCard, Event } from "@/app/components/EventCard";
import { Button } from "@/app/components/ui/button";
import { Plus, Filter, Calendar } from "lucide-react";

interface EventsListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onAddClick: () => void;
  onTogglePin: (eventId: string) => void;
}

export function EventsList({ events, onEventClick, onAddClick, onTogglePin }: EventsListProps) {
  const sortedEvents = [...events].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const upcomingEvents = sortedEvents.filter(
    (event) => event.date >= new Date(new Date().setHours(0, 0, 0, 0))
  );

  const pastEvents = sortedEvents.filter(
    (event) => event.date < new Date(new Date().setHours(0, 0, 0, 0))
  );

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Events</h2>
          <Button variant="outline" size="icon">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
          {upcomingEvents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Upcoming Events ({upcomingEvents.length})
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => onEventClick(event)}
                    onTogglePin={onTogglePin}
                  />
                ))}
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Past Events ({pastEvents.length})
              </h3>
              <div className="space-y-3 opacity-60">
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => onEventClick(event)}
                    onTogglePin={onTogglePin}
                  />
                ))}
              </div>
            </div>
          )}

          {events.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="size-12 mx-auto mb-3 opacity-50" />
              <p>No events scheduled</p>
              <p className="text-sm mt-2">Click "Add Event" to create your first event</p>
            </div>
          )}
        </div>
    </div>
  );
}