import { useState, useEffect } from "react";
import { EventsCalendar } from "@/app/components/EventsCalendar";
import { EventsList } from "@/app/components/EventsList";
import { PinnedEvents } from "@/app/components/PinnedEvents";
import { WatchedChannels } from "@/app/components/WatchedChannels";
import { ActivityMonitoring } from "@/app/components/ActivityMonitoring";
import { EventDialog } from "@/app/components/EventDialog";
import { AddEventDialog } from "@/app/components/AddEventDialog";
import { ConnectedAccountsDialog } from "@/app/components/ConnectedAccountsDialog";
import { AuthDialog } from "@/app/components/AuthDialog";
import { Event } from "@/app/components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { CalendarIcon, ListIcon, Plus, Pin, Moon, Sun, LogIn, LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [pinnedEventIds, setPinnedEventIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pinnedEventIds');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/events');
        const data = await response.json();

        if (data.events && Array.isArray(data.events)) {
          const mappedEvents: Event[] = data.events.map((dbEvent: any) => {
            const startDate = new Date(dbEvent.start_time);
            const endDate = dbEvent.end_time ? new Date(dbEvent.end_time) : new Date(startDate.getTime() + 60 * 60 * 1000);
            const id = dbEvent.id.toString();

            return {
              id,
              title: dbEvent.title,
              date: startDate,
              startTime: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              endTime: endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              location: dbEvent.location || 'Online',
              type: 'other', // Default type
              color: '#10b981', // Green for DB events
              description: dbEvent.description,
              pinned: pinnedEventIds.includes(id),
              imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" // Default image
            };
          });

          // Show only database events
          setEvents(mappedEvents);
        }
      } catch (error) {
        console.error("Failed to connect to backend:", error);
      }
    };

    fetchEvents();
  }, [pinnedEventIds]);

  // Persist pins
  useEffect(() => {
    localStorage.setItem('pinnedEventIds', JSON.stringify(pinnedEventIds));
  }, [pinnedEventIds]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConnectAccountsOpen, setIsConnectAccountsOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const handleEventAdd = async (newEvent: Event) => {
    try {
      // Combine date and time to create ISO strings
      const startDateTime = new Date(newEvent.date);
      const [startHour, startMinute] = newEvent.startTime.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute));

      const endDateTime = new Date(newEvent.date);
      const [endHour, endMinute] = newEvent.endTime.split(':');
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute));

      // POST to backend
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          location: newEvent.location,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          discordUserId: null, // Dashboard events don't have a Discord user
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const id = data.event.id.toString();
        // Add to local state with the ID from backend
        setEvents([...events, { ...newEvent, id, pinned: pinnedEventIds.includes(id) }]);
      } else {
        console.error('Failed to create event:', await response.text());
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleTogglePin = (eventId: string) => {
    setPinnedEventIds(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );

    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, pinned: !event.pinned } : event
      )
    );
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId));
        setPinnedEventIds(prev => prev.filter(id => id !== eventId));
        setIsDialogOpen(false);
      } else {
        console.error('Failed to delete event:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isConnectAccountsOpen, setIsConnectAccountsOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  });

  const [userEmail, setUserEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userEmail') || "";
    }
    return "";
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isDarkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem('isDarkMode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
    localStorage.setItem('userEmail', userEmail);
  }, [isLoggedIn, userEmail]);

  const [connectedAccounts, setConnectedAccounts] = useState(() => {
    const defaultAccounts = [
      {
        id: "discord",
        name: "Discord",
        icon: "🎮",
        connected: false,
        description: "Sync events from Discord servers and voice channels",
        redirectUrl: "https://discord.com/oauth2/authorize?client_id=1466770397948154008&scope=bot&permissions=8"
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
      {
        id: "zoom",
        name: "Zoom",
        icon: "🎥",
        connected: false,
        description: "Automatically import scheduled Zoom meetings",
      },
      {
        id: "teams",
        name: "Microsoft Teams",
        icon: "👥",
        connected: false,
        description: "Connect to Microsoft Teams meetings and events",
      },
      {
        id: "github",
        name: "GitHub",
        icon: "🐙",
        connected: false,
        description: "Track milestones, releases, and project deadlines",
      },
    ];

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectedAccounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge saved connection state with default account definitions (to keep icons/descriptions updated)
        return defaultAccounts.map(def => {
          const savedAcc = parsed.find((p: any) => p.id === def.id);
          return savedAcc ? { ...def, connected: savedAcc.connected } : def;
        });
      }
    }
    return defaultAccounts;
  });

  useEffect(() => {
    localStorage.setItem('connectedAccounts', JSON.stringify(connectedAccounts));
  }, [connectedAccounts]);

  const handleToggleAccount = (accountId: string) => {
    setConnectedAccounts(
      connectedAccounts.map((account) =>
        account.id === accountId
          ? { ...account, connected: !account.connected }
          : account
      )
    );
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const pinnedEvents = events.filter((event) => event.pinned);
  const connectedCount = connectedAccounts.filter((a) => a.connected).length;

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="hidden lg:grid lg:grid-cols-[1fr,400px] gap-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">Events Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage and track all your events in one place
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleToggleDarkMode}
                >
                  {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  {isDarkMode ? "Light" : "Dark"}
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Pin className="size-4" />
                  Pinned
                  <Badge variant="secondary" className="ml-1">
                    {pinnedEvents.length}
                  </Badge>
                </Button>
                <Button onClick={handleAddClick} variant="outline" size="sm" className="gap-2">
                  <Plus className="size-4" />
                  Add Event
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsConnectAccountsOpen(true)}
                >
                  <Link2 className="size-4" />
                  Connect
                  {connectedCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {connectedCount}
                    </Badge>
                  )}
                </Button>
                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleLogout}
                  >
                    <User className="size-4" />
                    <span className="hidden md:inline">{userEmail}</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    <LogIn className="size-4" />
                    Login
                  </Button>
                )}
              </div>
            </div>
            <div></div>
          </div>
          <div className="lg:hidden">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">Events Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage and track all your events in one place
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleToggleDarkMode}
                >
                  {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Pin className="size-4" />
                  <Badge variant="secondary" className="ml-1">
                    {pinnedEvents.length}
                  </Badge>
                </Button>
                <Button onClick={handleAddClick} variant="outline" size="sm" className="gap-2">
                  <Plus className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsConnectAccountsOpen(true)}
                >
                  <Link2 className="size-4" />
                  {connectedCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {pinnedEvents.length}
                    </Badge>
                  </Button>
                  <Button onClick={handleAddClick} variant="outline" size="sm" className="gap-2">
                    <Plus className="size-4" />
                    <span className="hidden md:inline">Add Event</span>
                  </Button>
                </>
              )}

              {user ? (
                <div className="flex gap-2 items-center ml-2 border-l pl-4">
                   <div className="hidden md:flex flex-col items-end">
                     <span className="text-sm font-medium">{user.username}</span>
                     <span className="text-xs text-muted-foreground">{user.email}</span>
                   </div>
                  <Button onClick={logout} variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                    <LogOut className="size-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAuthDialogOpen(true)} className="gap-2 ml-2">
                  <LogIn className="size-4" />
                  Logga in
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {!user ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 text-center">
             <div className="bg-muted p-6 rounded-full">
                <CalendarIcon className="size-12 text-muted-foreground" />
             </div>
             <h2 className="text-2xl font-bold">Välkommen till CalSync</h2>
             <p className="text-muted-foreground max-w-md">
               Logga in eller skapa ett konto för att hantera dina events och kalendrar.
             </p>
             <Button onClick={() => setIsAuthDialogOpen(true)} size="lg" className="gap-2">
               <LogIn className="size-5" />
               Kom igång
             </Button>
          </div>
        ) : (
          <>
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-[1fr,400px] h-full">
              <div className="border-r flex gap-6 p-6 overflow-y-auto">
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
                  <ActivityMonitoring />
                  <WatchedChannels />
                </div>
              </div>
              <div className="p-6 overflow-y-auto">
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
                <div className="border-b px-4 bg-card">
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
                  <div className="h-full overflow-y-auto p-4 space-y-6">
                    <EventsCalendar
                      events={events}
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      onEventClick={handleEventClick}
                    />
                    <PinnedEvents events={events} onEventClick={handleEventClick} />
                    <ActivityMonitoring />
                    <WatchedChannels />
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
          </>
        )}
      </div>

      {/* Dialogs */}
      <EventDialog
        event={selectedEvent}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTogglePin={handleTogglePin}
        onDelete={handleEventDelete}
      />
      <AddEventDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onEventAdd={handleEventAdd}
      />
      <ConnectedAccountsDialog
        open={isConnectAccountsOpen}
        onOpenChange={setIsConnectAccountsOpen}
        connectedAccounts={connectedAccounts}
        onToggleAccount={handleToggleAccount}
      />
      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
      />
    </div>
  );
}
