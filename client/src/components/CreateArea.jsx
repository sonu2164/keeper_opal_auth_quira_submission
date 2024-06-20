import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
function CreateArea({ addNote, note, setNote, isClicked, setIsClicked }) {



  function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    event.preventDefault();
    addNote(note);
  }
  function handleClick() {
    setIsClicked(true);
  }
  return (
    <div>
      <form className="create-note">
        {isClicked && (
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            value={note.title}
          />
        )}

        <textarea
          name="description"
          placeholder="Take a note..."
          rows={isClicked ? 3 : 1}
          onChange={handleChange}
          value={note.description}
          onClick={handleClick}

        />

        <Zoom in={isClicked ? true : false}>
          <Fab onClick={submitNote}><AddIcon /></Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
