import { useState } from "react";
import { Calendar } from "@/app/components/ui/calendar";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Event } from "@/app/components/EventCard";
import { format, isSameDay, differenceInMilliseconds } from "date-fns";
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

  // Logik för att hitta närmaste event (från den nya koden)
  const getClosestEvent = () => {
    if (events.length === 0) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events.reduce((closest, event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      
      const closestDate = new Date(closest.date);
      closestDate.setHours(0, 0, 0, 0);
      
      const eventDiff = Math.abs(differenceInMilliseconds(eventDate, today));
      const closestDiff = Math.abs(differenceInMilliseconds(closestDate, today));
      
      return eventDiff < closestDiff ? event : closest;
    });
  };

  const closestEvent = getClosestEvent();

  return (
    <div className="flex flex-col">
      {/* Header med navigation */}
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

      <div className="pt-6">
        <Card className="p-6">
          {/* Här sker magin för desktop-layouten: lg:flex-row */}
          <div className="flex flex-col lg:flex-row md:flex-row gap-6 ">
            
            {/* Kalender-sektionen */}
            <div className="flex-1">
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
                className="rounded-md border-0 w-full"
              />
            </div>

            {/* Event-sektionen (Höger sida på desktop) */}
            {/* lg:border-l lägger till en linje till vänster endast på desktop */}
            <div className="flex-1 lg:border-l lg:pl-6">
              
              {/* Scenario 1: Datum är valt och events finns */}
              {selectedDate && selectedDateEvents.length > 0 && (
                <div>
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
                </div>
              )}

              {/* Scenario 2: Inget datum valt (eller inga events på datumet), visa närmaste event */}
              {(!selectedDate || (selectedDate && selectedDateEvents.length === 0)) && closestEvent && (
                <div>
                   {/* Visa "Closest Event" rubrik om inget datum är valt */}
                  {!selectedDate && <h3 className="font-semibold mb-3">Closest Event</h3>}
                  
                  {/* Om datum är valt men tomt, visa "No events" text istället */}
                  {selectedDate && <h3 className="font-semibold mb-3 text-muted-foreground">No events on this day</h3>}

                  {!selectedDate && (
                    <div
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => onEventClick(closestEvent)}
                    >
                        <div className="flex items-center gap-3">
                        <div
                            className="size-3 rounded-full"
                            style={{ backgroundColor: closestEvent.color }}
                        />
                        <div>
                            <p className="font-medium">{closestEvent.title}</p>
                            <p className="text-sm text-muted-foreground">
                            {format(closestEvent.date, "MMMM d, yyyy")} • {closestEvent.startTime} - {closestEvent.endTime}
                            </p>
                        </div>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                        {closestEvent.type}
                        </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}