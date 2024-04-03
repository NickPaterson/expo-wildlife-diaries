import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (note) => {setNotes((currentNotes) => [...currentNotes, note]);}
  const removeNote = (id) => setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
  const updateNote = (updatedNote) => setNotes((currentNotes) => currentNotes.map((note) => note.id === updatedNote.id ? updatedNote : note));

  return (
    <NotesContext.Provider value={{ notes, addNote, removeNote, updateNote }}>
      {children}
    </NotesContext.Provider>
  );
};
