import { useState } from "react";
import { EventsCalendar } from "@/app/components/EventsCalendar";
import { EventsList } from "@/app/components/EventsList";
import { PinnedEvents } from "@/app/components/PinnedEvents";
import { EventDialog } from "@/app/components/EventDialog";
import { AddEventDialog } from "@/app/components/AddEventDialog";
import { LoginDialog } from "@/app/components/LoginDialog";
import { ConnectedAccountsDialog } from "@/app/components/ConnectedAccountsDialog";
import { Event } from "@/app/components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { CalendarIcon, ListIcon, Plus, Pin, LogIn, User, Link2, Moon, Sun } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

// Mock data for events - sorted by date (closest first)
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Team Standup Meeting",
    date: new Date(2026, 0, 27),
    startTime: "09:00 AM",
    endTime: "09:30 AM",
    location: "Conference Room A",
    type: "meeting",
    color: "#3b82f6",
    description: "Daily standup to discuss progress and blockers.",
    imageUrl: "https://images.unsplash.com/photo-1716703432455-3045789de738?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMGNvbmZlcmVuY2UlMjByb29tfGVufDF8fHx8MTc2OTc1OTg2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "2",
    title: "Design Review Session",
    date: new Date(2026, 0, 29),
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    location: "Virtual - Zoom",
    type: "meeting",
    color: "#3b82f6",
    description: "Review the latest design mockups for the new dashboard feature.",
    imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjByZXZpZXclMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY5NzY0MzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "8",
    title: "Code Review",
    date: new Date(2026, 0, 30),
    startTime: "03:00 PM",
    endTime: "04:00 PM",
    location: "Virtual",
    type: "meeting",
    color: "#3b82f6",
    description: "Review pull requests and discuss code quality improvements.",
    imageUrl: "https://images.unsplash.com/photo-1735815952441-224afdf53016?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwcmV2aWV3JTIwcHJvZ3JhbW1pbmd8ZW58MXx8fHwxNzY5NzY0MzU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "10",
    title: "Doctor's Appointment",
    date: new Date(2026, 1, 1),
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    location: "Medical Center",
    type: "reminder",
    color: "#eab308",
    description: "Annual checkup appointment.",
    imageUrl: "https://images.unsplash.com/photo-1615983276036-8dd65aa005a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJpbmFyJTIwb25saW5lJTIwdHJhaW5pbmd8ZW58MXx8fHwxNzY5NzY0MzU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "6",
    title: "Client Presentation",
    date: new Date(2026, 1, 3),
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    location: "Client Office",
    type: "meeting",
    color: "#3b82f6",
    description: "Present the final proposal and timeline to the client stakeholders.",
    pinned: true,
    imageUrl: "https://images.unsplash.com/photo-1758519288417-d359ac3c494d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNsaWVudCUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3Njk3NjQzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "3",
    title: "Tech Conference 2026",
    date: new Date(2026, 1, 5),
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    location: "Convention Center",
    type: "conference",
    color: "#a855f7",
    description: "Annual technology conference featuring keynote speakers and workshops.",
    imageUrl: "https://images.unsplash.com/photo-1762968274962-20c12e6e8ecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29uZmVyZW5jZSUyMGtleW5vdGV8ZW58MXx8fHwxNzY5NzY0MzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "4",
    title: "Sarah's Birthday Party",
    date: new Date(2026, 1, 8),
    startTime: "06:00 PM",
    endTime: "09:00 PM",
    location: "Downtown Restaurant",
    type: "birthday",
    color: "#ec4899",
    description: "Birthday celebration dinner for Sarah. Don't forget the gift!",
    imageUrl: "https://images.unsplash.com/photo-1650584997985-e713a869ee77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY5NzUxNjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "7",
    title: "Team Building Workshop",
    date: new Date(2026, 1, 12),
    startTime: "01:00 PM",
    endTime: "04:00 PM",
    location: "Outdoor Park",
    type: "other",
    color: "#6b7280",
    description: "Quarterly team building activities and games.",
    imageUrl: "https://images.unsplash.com/photo-1758582388621-6ea162744083?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwYnVpbGRpbmclMjBvdXRkb29yJTIwYWN0aXZpdGllc3xlbnwxfHx8fDE3Njk3MTkxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "5",
    title: "Project Deadline",
    date: new Date(2026, 1, 14),
    startTime: "11:59 PM",
    endTime: "11:59 PM",
    type: "reminder",
    color: "#eab308",
    description: "Final submission deadline for Q1 project deliverables.",
    pinned: true,
    imageUrl: "https://images.unsplash.com/photo-1624969862293-b749659ccc4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWFkbGluZSUyMGNhbGVuZGFyJTIwcmVtaW5kZXJ8ZW58MXx8fHwxNzY5NzY0MzU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "9",
    title: "Product Launch Event",
    date: new Date(2026, 1, 20),
    startTime: "06:00 PM",
    endTime: "09:00 PM",
    location: "Grand Ballroom",
    type: "conference",
    color: "#a855f7",
    description: "Official launch event for our new product line.",
    pinned: true,
    imageUrl: "https://images.unsplash.com/photo-1768508948485-a7adc1f3427f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JraW5nJTIwZXZlbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5NzIyMDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export default function App() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isConnectAccountsOpen, setIsConnectAccountsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: "discord",
      name: "Discord",
      icon: "🎮",
      connected: false,
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
  ]);

  const handleLogin = (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    setIsLoggedIn(true);
    setUserEmail(email);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
  };

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

  return (
    <div className="h-screen flex flex-col bg-background">
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
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    <LogIn className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

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
            <div className="w-[300px]">
              <PinnedEvents events={events} onEventClick={handleEventClick} />
            </div>
          </div>
          <div>
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
                <div className="border-t">
                  <PinnedEvents events={events} onEventClick={handleEventClick} />
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

      {/* Event Details Dialog */}
      <EventDialog
        event={selectedEvent}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTogglePin={handleTogglePin}
      />

      {/* Add Event Dialog */}
      <AddEventDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onEventAdd={handleEventAdd}
      />

      {/* Login Dialog */}
      <LoginDialog
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onLogin={handleLogin}
      />

      {/* Connected Accounts Dialog */}
      <ConnectedAccountsDialog
        open={isConnectAccountsOpen}
        onOpenChange={setIsConnectAccountsOpen}
        connectedAccounts={connectedAccounts}
        onToggleAccount={handleToggleAccount}
      />
    </div>
  );
}