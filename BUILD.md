# Events Dashboard - Build Documentation

## Application Overview

A modern, responsive events dashboard application built with React, TypeScript, and Tailwind CSS. Features a split-screen layout on desktop (calendar on left, events list on right) and tab-based navigation on mobile devices.

---

## Tech Stack

### Core Framework
- **React** 18.3.1
- **TypeScript** (via Vite)
- **Vite** 6.3.5 - Build tool and dev server
- **Tailwind CSS** 4.1.12 - Utility-first CSS framework

### UI Components
- **Radix UI** - Headless UI components for accessibility
  - Dialog, Tabs, Select, Dropdown, Accordion, and more
- **Lucide React** 0.487.0 - Icon library
- **class-variance-authority** 0.7.1 - Component variant management
- **clsx** 2.1.1 - Conditional className utility
- **tailwind-merge** 3.2.0 - Merge Tailwind classes intelligently

### Additional Libraries
- **date-fns** 3.6.0 - Date manipulation and formatting
- **react-day-picker** 8.10.1 - Calendar component
- **react-hook-form** 7.55.0 - Form validation and management
- **sonner** 2.0.3 - Toast notifications
- **motion** 12.23.24 - Animation library (formerly Framer Motion)
- **recharts** 2.15.2 - Charting library
- **react-dnd** 16.0.1 - Drag and drop functionality

---

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                      # Main application component
│   │   └── components/
│   │       ├── AddEventDialog.tsx       # Dialog for adding new events
│   │       ├── ConnectedAccountsDialog.tsx  # Dialog for managing connected accounts
│   │       ├── EventCard.tsx            # Individual event card component
│   │       ├── EventDialog.tsx          # Dialog for viewing/editing event details
│   │       ├── EventsCalendar.tsx       # Calendar view component
│   │       ├── EventsList.tsx           # List view of events
│   │       ├── LoginDialog.tsx          # Login/authentication dialog
│   │       ├── PinnedEvents.tsx         # Pinned events section
│   │       ├── figma/
│   │       │   └── ImageWithFallback.tsx  # Image component with fallback
│   │       └── ui/                      # Reusable UI components
│   │           ├── button.tsx
│   │           ├── badge.tsx
│   │           ├── dialog.tsx
│   │           ├── tabs.tsx
│   │           ├── input.tsx
│   │           ├── label.tsx
│   │           ├── select.tsx
│   │           ├── textarea.tsx
│   │           └── ... (other UI primitives)
│   └── styles/
│       ├── theme.css                    # CSS custom properties and theme tokens
│       ├── fonts.css                    # Font imports
│       └── global.css                   # Global styles
├── package.json                         # Dependencies and scripts
└── vite.config.ts                       # Vite configuration
```

---

## Key Features

### 1. Event Management
- **Add Events**: Create new events with title, date, time, location, type, description, and image URL
- **View Events**: Detailed event view in dialog modal
- **Pin Events**: Pin important events to a dedicated section
- **Auto-sorting**: Events automatically sorted by date (closest first)
- **URL Import**: Paste event URLs (Meetup, Eventbrite, Zoom) that redirect to registration pages

### 2. Calendar View
- Interactive calendar using `react-day-picker`
- Visual indicators for days with events
- Date selection to filter events
- Responsive grid layout

### 3. Event Types & Colors
- Meeting (Blue - #3b82f6)
- Workshop (Purple - #8b5cf6)
- Conference (Green - #10b981)
- Deadline (Red - #ef4444)
- Social (Orange - #f97316)

### 4. User Authentication
- Mock login system
- User profile display
- Logout functionality

### 5. Connected Accounts
- Integration placeholders for:
  - Google Calendar
  - Slack
  - Zoom
  - Microsoft Teams
  - GitHub
- Toggle connections on/off

### 6. Dark Mode
- Toggle between light and dark themes
- Persistent dark mode using document class
- Moon/Sun icons for theme indication

### 7. Responsive Design
- **Desktop (lg+)**: 2-column grid layout
  - Left column: Calendar + Pinned Events (side-by-side)
  - Right column: Events List
- **Mobile**: Tab-based navigation
  - Calendar tab
  - Events list tab

---

## Component Architecture

### Main App Component (`/src/app/App.tsx`)
- State management for events, dialogs, authentication, dark mode
- Event CRUD operations (Create, Read, Update, Delete)
- Pin/unpin functionality
- Layout rendering for desktop and mobile

### Event Card (`/src/app/components/EventCard.tsx`)
```typescript
interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  type: "meeting" | "workshop" | "conference" | "deadline" | "social";
  color: string;
  description: string;
  imageUrl?: string;
}
```

### Calendar Component (`/src/app/components/EventsCalendar.tsx`)
- Date picker with event indicators
- Modifiers for days with events
- Date selection handler

### Events List (`/src/app/components/EventsList.tsx`)
- Scrollable list of event cards
- Sorted by date
- Actions: View, Pin, Delete

### Pinned Events (`/src/app/components/PinnedEvents.tsx`)
- Dedicated section for pinned events
- Quick access to important events
- Unpin functionality

### Add Event Dialog (`/src/app/components/AddEventDialog.tsx`)
- Form with native HTML5 date/time pickers
- URL input with search/redirect functionality
- Event type selection
- Image URL input

---

## Styling System

### Tailwind CSS v4
- Utility-first CSS framework
- Custom theme tokens in `/src/styles/theme.css`
- No traditional `tailwind.config.js` (using v4 CSS-based config)

### CSS Variables
Theme colors, spacing, and typography defined in CSS custom properties:
```css
:root {
  --color-primary: ...;
  --color-secondary: ...;
  --spacing-unit: ...;
}
```

### Dark Mode Implementation
- Uses `.dark` class on document root
- Toggle via dark mode button
- Tailwind dark mode classes (e.g., `dark:bg-gray-900`)

---

## Build & Development

### Installation
```bash
npm install
# or
pnpm install
```

### Development Server
```bash
npm run dev
# or
pnpm dev
```

### Production Build
```bash
npm run build
# or
pnpm build
```

### Build Output
- Output directory: `/dist`
- Optimized and minified assets
- Ready for static hosting (Netlify, Vercel, etc.)

---

## Data Structure

### Mock Events (10 Sample Events)
Located in `/src/app/App.tsx`:
1. Team Standup Meeting (Jan 27, 2026)
2. Design Review Session (Jan 29, 2026)
3. Code Review (Jan 30, 2026)
4. Product Launch (Feb 1, 2026)
5. UX Research Workshop (Feb 5, 2026)
6. Tech Conference 2026 (Feb 15, 2026)
7. Q1 Planning Session (Feb 20, 2026)
8. Client Presentation (Feb 25, 2026)
9. Team Social Event (Feb 28, 2026)
10. Project Deadline (Mar 1, 2026)

### Connected Accounts
Mock integration data for:
- Google Calendar (Calendar icon)
- Slack (Chat icon)
- Zoom (Video icon)
- Microsoft Teams (Teams icon)
- GitHub (Code icon)

---

## Key Dependencies Explanation

| Package | Purpose |
|---------|---------|
| `@radix-ui/*` | Accessible, unstyled UI primitives |
| `lucide-react` | Icon library (Moon, Sun, Calendar, Plus, etc.) |
| `date-fns` | Date formatting and manipulation |
| `react-day-picker` | Interactive calendar component |
| `react-hook-form` | Form state management and validation |
| `motion` | Smooth animations and transitions |
| `sonner` | Toast notifications |
| `clsx` & `tailwind-merge` | Dynamic className management |
| `class-variance-authority` | Component variant patterns |

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript features
- CSS Grid and Flexbox support required

---

## Configuration Files

### `vite.config.ts`
- React plugin configuration
- Path aliases (`@` -> `/src`)
- Build optimization settings

### `package.json`
- Dependencies locked to specific versions
- Build script: `vite build`
- Module type: ESM

---

## Future Enhancements (Not Implemented)

- Real backend API integration
- Actual calendar service connections
- Event reminders/notifications
- Recurring events
- Event search and filtering
- Event categories/tags
- Export to ICS/Calendar formats
- Multi-user collaboration
- Event attachments
- Email notifications

---

## Notes

- **No Backend**: Currently uses mock data and localStorage could be added for persistence
- **No Real Authentication**: Login is simulated for UI demonstration
- **No API Calls**: All integrations are UI-only placeholders
- **Attendees Removed**: Intentionally excluded to simplify data requirements
- **URL Import**: Opens external event URLs in new tab while saving reference

---

## Development Guidelines

1. **Component Creation**: Place in `/src/app/components`
2. **Imports**: Use `@/` alias for absolute imports
3. **Styling**: Use Tailwind utilities, avoid custom CSS
4. **Icons**: Use Lucide React icons
5. **Forms**: Use native HTML5 inputs for dates/times
6. **State**: Manage in App.tsx, pass as props
7. **Types**: Define interfaces in component files

---

## Version Information

- **Application Version**: 0.0.1
- **Build Date**: January 30, 2026
- **React Version**: 18.3.1
- **Tailwind Version**: 4.1.12
- **Vite Version**: 6.3.5
