const { google } = require("googleapis");
const { oAuth2Client, setCredentials } = require("./googleAuth");

async function createEvent(note) {
  setCredentials();

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const event = {
    summary: note.title,
    description: note.content,
    start: {
      dateTime: note.startDateTime,
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: note.endDateTime,
      timeZone: "America/Los_Angeles",
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    console.log("Event created: %s", response.data.htmlLink);
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

module.exports = createEvent;
