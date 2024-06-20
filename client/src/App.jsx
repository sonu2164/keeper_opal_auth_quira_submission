import React, { useState, useEffect } from 'react';
import axios from './utils/axiosConfig';

import { toast } from "react-toastify";
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Header from './components/Header';
import Note from './components/Note';
import CreateArea from './components/CreateArea';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [noteIdToUpdate, setNoteIdToUpdate] = useState(null);
  const [showRegister, setShowRegister] = useState(false)
  const [note, setNote] = useState({
    title: "",
    description: ""
  });
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      getNotes();
    }
  }, [isAuthenticated]);

  const getNotes = async () => {
    try {
      const res = await axios.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addNote = async (note) => {
    try {
      if (noteIdToUpdate) {
        const response = await axios.post(`/note/update/`, { ...note, noteId: noteIdToUpdate }, config);

        getNotes();
        setNoteIdToUpdate(null);
        setIsClicked(false);
        toast.success('Note updated successfully');
      } else {
        const res = await axios.post('/newNote', note, config);
        setNotes([...notes, res.data]);
        toast.success('Note added successfully');
      }
    } catch (err) {
      console.error(err.response.data);
      if (err.response.data.message === "Unauthorized") {
        toast.error('Failed to update note, you are not the owner of this note.');

      }
      else toast.error('Failed to create new note.')

    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.post(`/note/delete/`, { noteId: id }, config);
      getNotes();
      toast.success('Note deleted successfully');
    } catch (err) {
      console.error(err.response.data);
      toast.error('Failed to delete note, you are not owner of this note.');
    }
  };

  const updateNote = (id, index) => {
    setIsClicked(true);
    setNoteIdToUpdate(id);
    setNote({
      title: notes[index].title,
      description: notes[index].description,
    });
  };

  return (
    <div>
      <ToastContainer />
      <Header />
      {isAuthenticated ? (
        <div>
          <CreateArea addNote={addNote} note={note} setNote={setNote} isClicked={isClicked} setIsClicked={setIsClicked} />
          {notes.map((note, index) => (
            <Note
              key={index}
              ind={index}
              id={note.id}
              title={note.title}
              content={note.description}
              deleteNote={deleteNote}
              updateNote={updateNote}
            />
          ))}
        </div>
      ) : (
        <div className='auth-container'>
          {showRegister ?
            (<Register setIsAuthenticated={setIsAuthenticated} setShowRegister={setShowRegister} />) :
            (<Login setIsAuthenticated={setIsAuthenticated} setShowRegister={setShowRegister} />)
          }
        </div>
      )}
    </div>
  );
};

export default App;
