import React, { useState } from "react";
import axios from "axios";

const AddNote: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddNote = async () => {
    const startDateTime = new Date();
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour later

    const note = {
      title,
      content,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/api/testAddNoteToCal",
        note
      );
      alert(response.data);
    } catch (error) {
      console.error("Error adding note or creating event:", error);
    }
  };

  return (
    <div>
      <h1>Add Note</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
};

export default AddNote;
