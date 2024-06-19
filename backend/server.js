const express = require("express");
const redis = require("redis");
const cors = require("cors");
const { oAuth2Client, saveToken } = require("./googleAuth");
const createEvent = require("./createEvent");
const { getAccessToken } = require("./googleAuth");

const app = express();
app.use(cors());
const client = redis.createClient();

client.on("error", (err) => {
  console.error("Redis error:", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

app.use(express.json());

app.get("/api/auth", (req, res) => {
  getAccessToken();
  res.send("Check your console for the authorization URL");
});

app.post("/api/addNote", async (req, res) => {
  const { title, content } = req.body;
  try {
    await client.hSet(title, "content", content);
    await client.hSet(title, "timestamp", Date.now().toString());
    res.status(200).json({ message: "Note added successfully!" });
  } catch (err) {
    console.error("Error adding note:", err);
    res.status(500).json({ error: "Error adding note", details: err.message });
  }
});

app.delete("/api/deleteNote", async (req, res) => {
  const { title } = req.body;
  try {
    const result = await client.del(title);
    if (result === 1) {
      res.status(200).json({ message: "Note deleted successfully!" });
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (err) {
    console.error("Error deleting note:", err);
    res
      .status(500)
      .json({ error: "Error deleting note", details: err.message });
  }
});

app.get("/api/fetchNotes", async (req, res) => {
  try {
    const keys = await client.keys("*");
    const fetchedNotes = [];
    for (const key of keys) {
      const redisNote = await client.hGetAll(key);
      if (redisNote) {
        fetchedNotes.push({
          title: key,
          content: redisNote.content,
          timestamp: new Date(parseInt(redisNote.timestamp)).toLocaleString(),
        });
      }
    }
    res.status(200).json(fetchedNotes);
  } catch (err) {
    console.error("Error retrieving all notes:", err);
    res
      .status(500)
      .json({ error: "Error retrieving all notes", details: err.message });
  }
});

// Add a test route to ensure the server is running
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.post("/api/testAddNoteToCal", async (req, res) => {
  const note = req.body;
  try {
    await createEvent(note);
    res.status(200).send("Note added and event created in Google Calendar");
  } catch (error) {
    console.error("Error adding note or creating event:", error);
    res.status(500).send("Error adding note or creating event");
  }
});

app.get("/api/oauth2callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  saveToken(tokens);
  res.send("Authorization successful. You can close this window.");
});

const PORT = process.env.PORT || 3001;
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
