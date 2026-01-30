import { Calendar, Clock, MapPin, Pin } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

export interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  type: "meeting" | "conference" | "birthday" | "reminder" | "other";
  description?: string;
  color: string;
  pinned?: boolean;
  imageUrl?: string;
}

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  onTogglePin?: (event: Event) => void;
}

const eventTypeColors: Record<Event["type"], string> = {
  meeting: "bg-blue-500",
  conference: "bg-purple-500",
  birthday: "bg-pink-500",
  reminder: "bg-yellow-500",
  other: "bg-gray-500",
};

export function EventCard({ event, onClick, onTogglePin }: EventCardProps) {
  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4"
      style={{ borderLeftColor: event.color }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold truncate">{event.title}</h3>
            <Badge variant="secondary" className="capitalize">
              {event.type}
            </Badge>
          </div>
          
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 flex-shrink-0" />
              <span>
                {event.date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="size-4 flex-shrink-0" />
              <span>
                {event.startTime} - {event.endTime}
              </span>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onTogglePin && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(event);
              }}
            >
              <Pin
                className={`size-4 ${
                  event.pinned
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
          )}
          <div
            className={`size-3 rounded-full flex-shrink-0 ${eventTypeColors[event.type]}`}
          />
        </div>
      </div>
      
      {event.description && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      )}
    </Card>
  );
}
