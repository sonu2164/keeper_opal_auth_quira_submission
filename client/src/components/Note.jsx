import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
function Note(props) {
  function handleclickDelete() {
    props.deleteNote(props.id);
  }
  function handleclickUpdate() {
    console.log("clciked");
    props.updateNote(props.id, props.ind);
  }

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={handleclickDelete}><DeleteIcon /></button>
      <button onClick={handleclickUpdate}><EditIcon /></button>
    </div>
  );
}

export default Note;
