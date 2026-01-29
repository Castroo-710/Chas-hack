/**
 * Calendar Sync - Google Calendar API integration
 */

const { google } = require('googleapis');

// TODO: Sätt upp OAuth2 client
// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );

async function createCalendarEvent(event) {
  // TODO: Implementera Google Calendar API anrop
  // https://developers.google.com/calendar/api/v3/reference/events/insert

  const calendarEvent = {
    summary: event.title,
    description: event.description,
    start: {
      dateTime: event.startDate,
      timeZone: 'Europe/Stockholm',
    },
    end: {
      dateTime: event.endDate,
      timeZone: 'Europe/Stockholm',
    },
  };

  // const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  // const result = await calendar.events.insert({
  //   calendarId: 'primary',
  //   resource: calendarEvent,
  // });

  return { success: true, eventId: null };
}

async function updateCalendarEvent(eventId, updates) {
  // TODO: Implementera update
  return { success: true };
}

async function deleteCalendarEvent(eventId) {
  // TODO: Implementera delete
  return { success: true };
}

function generateICS(events) {
  // TODO: Generera .ics fil för manuell import
  // Format: https://icalendar.org/

  let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CalSync//EN\n';

  // events.forEach(event => {
  //   ics += 'BEGIN:VEVENT\n';
  //   ics += `SUMMARY:${event.title}\n`;
  //   ics += `DTSTART:${event.date}\n`;
  //   ics += 'END:VEVENT\n';
  // });

  ics += 'END:VCALENDAR';
  return ics;
}

module.exports = {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  generateICS,
};
