import React, { useEffect, useState } from "react";
import "./style.css";

interface Note {
  title: string;
  content: string;
  timestamp: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function addNote(): Promise<void> {
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const content = (document.getElementById("content") as HTMLTextAreaElement)
      .value;

    try {
      const response = await fetch("/api/addNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        console.log("Note added successfully!");
        fetchNotes();
      } else {
        const errorData = await response.json();
        console.error("Error adding note:", errorData);
      }
    } catch (err) {
      console.error("Error adding note:", err);
    }
  }

  async function deleteNote(title: string): Promise<void> {
    try {
      const response = await fetch("/api/deleteNote", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        console.log("Note deleted successfully!");
        fetchNotes();
      } else {
        const errorData = await response.json();
        console.error("Error deleting note:", errorData);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  }

  async function fetchNotes(): Promise<void> {
    try {
      const response = await fetch("/api/fetchNotes");
      if (response.ok) {
        const fetchedNotes = await response.json();
        setNotes(fetchedNotes);
      } else {
        const errorData = await response.json();
        console.error("Error retrieving all notes:", errorData);
      }
    } catch (err) {
      console.error("Error retrieving all notes:", err);
    }
  }
  return (
    <div>
      <h1>Recuerdame</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNote();
        }}
      >
        <input type="text" id="title" placeholder="Title" required />
        <textarea id="content" placeholder="Content" required></textarea>
        <button type="submit">Agrega un recuerdo</button>
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note.title}>
            <strong>{note.title}</strong>
            <p>{note.content}</p>
            <small>{note.timestamp}</small>
            <button onClick={() => deleteNote(note.title)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
