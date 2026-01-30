const ics = require('ics');

function createIcsFeed(events) {
  // Mappa våra DB-events till ics-format
  const icsEvents = events.map(event => {
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    
    return {
      title: event.title,
      description: event.description,
      location: event.location,
      start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
      end: [end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes()],
      url: event.source_url
    };
  });

  return new Promise((resolve, reject) => {
    ics.createEvents(icsEvents, (error, value) => {
      if (error) {
        reject(error);
      }
      resolve(value);
    });
  });
}

module.exports = { createIcsFeed };
