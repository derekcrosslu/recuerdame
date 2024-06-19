const redis = require("redis");
const readline = require("readline");

// Create a Redis client
const client = redis.createClient();

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function addNote() {
  const title = await new Promise((resolve) => {
    rl.question("Enter note title: ", resolve);
  });
  const content = await new Promise((resolve) => {
    rl.question("Enter note content: ", resolve);
  });

  try {
    await client.set(title, content);
    console.log("Note added successfully!");
  } catch (err) {
    console.error("Error adding note:", err);
  }
  main();
}

async function getNote() {
  const title = await new Promise((resolve) => {
    rl.question("Enter note title: ", resolve);
  });

  try {
    const content = await client.get(title);
    if (content) {
      console.log("Note:");
      console.log("Title:", title);
      console.log("Content:", content);
    } else {
      console.log("Note not found.");
    }
  } catch (err) {
    console.error("Error retrieving note:", err);
  }
  main();
}

async function deleteNote() {
  const title = await new Promise((resolve) => {
    rl.question("Enter note title: ", resolve);
  });

  try {
    const result = await client.del(title);
    if (result === 1) {
      console.log("Note deleted successfully!");
    } else {
      console.log("Note not found.");
    }
  } catch (err) {
    console.error("Error deleting note:", err);
  }
  main();
}

async function getAllNotes() {
  try {
    const keys = await client.keys("*");
    console.log("All notes:");
    for (const key of keys) {
      console.log("- " + key);
    }
  } catch (err) {
    console.error("Error retrieving all notes:", err);
  }
  main();
}

async function deleteAllNotes() {
  try {
    const keys = await client.keys("*");
    for (const key of keys) {
      await client.del(key);
    }
    console.log("All notes deleted successfully!");
  } catch (err) {
    console.error("Error deleting all notes:", err);
  }
  main();
}

async function main() {
  console.log("\nNote Taker");
  console.log("1. Add Note");
  console.log("2. Get Note");
  console.log("3. Delete Note");
  console.log("4. Get All Notes");
  console.log("5. Delete All Notes");
  console.log("6. Exit");

  const choice = await new Promise((resolve) => {
    rl.question("Enter your choice (1-6): ", resolve);
  });

  switch (choice) {
    case "1":
      await addNote();
      break;
    case "2":
      await getNote();
      break;
    case "3":
      await deleteNote();
      break;
    case "4":
      await getAllNotes();
      break;
    case "5":
      await deleteAllNotes();
      break;
    case "6":
      console.log("Exiting...");
      await client.quit();
      rl.close();
      break;
    default:
      console.log("Invalid choice. Please try again.");
      main();
  }
}

// Start the application
async function startApp() {
  try {
    await client.connect();
    console.log("Connected to Redis");
    main();
  } catch (err) {
    console.error("Redis error:", err);
  }
}

startApp();
