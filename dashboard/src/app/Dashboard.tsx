import { useState, useEffect } from "react";
import { EventsCalendar } from "@/app/components/EventsCalendar";
import { EventsList } from "@/app/components/EventsList";
import { PinnedEvents } from "@/app/components/PinnedEvents";
import { WatchedChannels } from "@/app/components/WatchedChannels";
import { EventDialog } from "@/app/components/EventDialog";
import { AddEventDialog } from "@/app/components/AddEventDialog";
import { ConnectedAccountsDialog } from "@/app/components/ConnectedAccountsDialog";
import { Event } from "@/app/components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { CalendarIcon, ListIcon } from "lucide-react";
import { useAuth } from "./hooks/useAuth";

export function Dashboard() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isConnectAccountsOpen, setIsConnectAccountsOpen] = useState(false);

    // Fetch real events when user is logged in
    useEffect(() => {
        if (user) {
            // TODO: Fetch real events from API
        }
    }, [user]);

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    const handleAddClick = () => {
        setIsAddDialogOpen(true);
    };

    const handleEventAdd = (newEvent: Event) => {
        setEvents([...events, newEvent]);
    };

    const handleTogglePin = (eventId: string) => {
        setEvents(
            events.map((event) =>
                event.id === eventId ? { ...event, pinned: !event.pinned } : event
            )
        );
    };
    
    // connectedAccounts is only used in ConnectedAccountsDialog, no need for state here
    const mockConnectedAccounts = [
        {
          id: "discord",
          name: "Discord",
          icon: "🎮",
          connected: !!user,
          description: "Sync events from Discord servers and voice channels",
        },
        {
          id: "slack",
          name: "Slack",
          icon: "💬",
          connected: false,
          description: "Import meetings and reminders from Slack channels",
        },
        {
          id: "google",
          name: "Google Calendar",
          icon: "📅",
          connected: false,
          description: "Sync with your Google Calendar events",
        },
    ];

    const handleToggleAccount = (accountId: string) => {
        // This is a mock handler for the ConnectedAccountsDialog
        // In a real app, this would update user's connected accounts in backend
        console.log(`Toggle account ${accountId}`);
    };

    const pinnedEvents = events.filter((event) => event.pinned);

    return (
        <>
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-[1fr,400px]">
                    <div className="border-r flex gap-6 p-6">
                        <div className="flex-1">
                            <EventsCalendar
                                events={events}
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                                onEventClick={handleEventClick}
                            />
                        </div>
                        <div className="w-[300px] space-y-6">
                            <PinnedEvents events={events} onEventClick={handleEventClick} />
                            {user && <WatchedChannels />}
                        </div>
                    </div>
                    <div className="p-6">
                        <EventsList
                            events={events}
                            onEventClick={handleEventClick}
                            onAddClick={handleAddClick}
                            onTogglePin={handleTogglePin}
                        />
                    </div>
                </div>

                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden h-full">
                    <Tabs defaultValue="calendar" className="h-full flex flex-col">
                        <div className="border-b px-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="calendar" className="gap-2">
                                    <CalendarIcon className="size-4" />
                                    Calendar
                                </TabsTrigger>
                                <TabsTrigger value="list" className="gap-2">
                                    <ListIcon className="size-4" />
                                    Events
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="calendar" className="flex-1 m-0 overflow-hidden">
                            <div className="h-full overflow-y-auto">
                                <EventsCalendar
                                    events={events}
                                    selectedDate={selectedDate}
                                    onDateSelect={setSelectedDate}
                                    onEventClick={handleEventClick}
                                />
                                <div className="border-t p-4 space-y-6">
                                    <PinnedEvents events={events} onEventClick={handleEventClick} />
                                    {user && <WatchedChannels />}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="list" className="flex-1 m-0 overflow-hidden">
                            <EventsList
                                events={events}
                                onEventClick={handleEventClick}
                                onAddClick={handleAddClick}
                                onTogglePin={handleTogglePin}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Dialogs */}
            <EventDialog
                event={selectedEvent}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onTogglePin={handleTogglePin}
            />
            <AddEventDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onEventAdd={handleEventAdd}
            />
            <ConnectedAccountsDialog
                open={isConnectAccountsOpen}
                onOpenChange={setIsConnectAccountsOpen}
                connectedAccounts={mockConnectedAccounts}
                onToggleAccount={handleToggleAccount}
            />
        </>
    );
}
