import { useState } from "react";
import { Calendar } from "@/app/components/ui/calendar";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Event } from "@/app/components/EventCard";
import { format, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface EventsCalendarProps {
  events: Event[];
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  onEventClick: (event: Event) => void;
}

export function EventsCalendar({
  events,
  selectedDate,
  onDateSelect,
  onEventClick,
}: EventsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const eventDates = events.map((event) => event.date);

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="flex flex-col">
      <div className="pb-4 border-b h-[60px] flex items-end">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() - 1);
                setCurrentMonth(newMonth);
              }}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() + 1);
                setCurrentMonth(newMonth);
              }}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="pt-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            modifiers={{
              hasEvents: eventDates,
            }}
            modifiersClassNames={{
              hasEvents: "font-bold relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-primary",
            }}
            className="rounded-md border w-full"
          />
        </div>

        {selectedDate && selectedDateEvents.length > 0 && (
          <div className="px-6 pb-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">
                Events on {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              <div className="space-y-2">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.startTime} - {event.endTime}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}