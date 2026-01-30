import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Event } from "@/app/components/EventCard";
import { Calendar, Clock, MapPin, Tag, Pin } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

interface EventDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTogglePin?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

export function EventDialog({ event, open, onOpenChange, onTogglePin, onDelete }: EventDialogProps) {
  if (!event) return null;

  const handleTogglePin = () => {
    if (onTogglePin) {
      onTogglePin(event.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(event.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {event.imageUrl && (
          <div className="w-full h-48 -mt-6 -mx-6 mb-4 overflow-hidden rounded-t-lg">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl">{event.title}</DialogTitle>
              <DialogDescription className="mt-2">
                <Badge variant="secondary" className="capitalize">
                  <Tag className="size-3 mr-1" />
                  {event.type}
                </Badge>
              </DialogDescription>
            </div>
            <div
              className="size-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: event.color }}
            />
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-start gap-3">
            <Calendar className="size-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-sm text-muted-foreground">
                {event.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="size-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Time</p>
              <p className="text-sm text-muted-foreground">
                {event.startTime} - {event.endTime}
              </p>
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
            </div>
          )}

          {event.description && (
            <div className="pt-4 border-t">
              <p className="font-medium mb-2">Description</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant={event.pinned ? "secondary" : "default"}
              className="flex-1"
              onClick={handleTogglePin}
            >
              <Pin className={`size-4 mr-2 ${event.pinned ? "fill-current" : ""}`} />
              {event.pinned ? "Unpin" : "Pin Event"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}