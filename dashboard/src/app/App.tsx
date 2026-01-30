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
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user, logout, isLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
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

  const [connectedAccounts, setConnectedAccounts] = useState([
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
  ]);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Events Dashboard</h1>
              <p className="text-muted-foreground text-sm hidden md:block">
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
                <span className="hidden md:inline">{isDarkMode ? "Light" : "Dark"}</span>
              </Button>
              
              {user && (
                <>
                  <Button variant="outline" size="sm" className="gap-2 hidden md:flex">
                    <Pin className="size-4" />
                    Pinned
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
