import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './../Utils/supabase';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [favourites, setFavourites] = useState([]);
  
  // useEffect(() => {
  //   const fetchNotes = async () => {
  //     const savedNotes = await AsyncStorage.getItem('notes');
  //     if (savedNotes) setNotes(JSON.parse(savedNotes));
  //     const savedFavourites = await AsyncStorage.getItem('favourites');
  //     if (savedFavourites) setFavourites(JSON.parse(savedFavourites));

  //   };
  //   fetchNotes();
  // }, []);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data: notes, error } = await supabase.from('notes').select('*');
        if (error) {
          console.log('Error fetching notes:', error.message);
          return;
        };

        if (notes && notes.length > 0) {
          setNotes(notes);
        }
      } catch (error) {
        console.log('Error fetching notes:', error.message);
      };
    }
    fetchNotes();
    console.log(notes);
  }, []);

  // useEffect(() => {
  //   AsyncStorage.setItem('notes', JSON.stringify(notes));
  // }, [notes]);

  useEffect(() => {
    const saveNotes = async () => {
      try {
        const { data, error } = await supabase.from('notes').upsert(notes);
        if (error) {
          console.log('Error saving notes:', error.message);
          return;
        };
      } catch (error) {
        console.log('Error saving notes:', error.message);
      };
    }
    saveNotes();
  }, [notes]);

  useEffect(() => {
    AsyncStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  const addNote = (note) => {setNotes((currentNotes) => [...currentNotes, note]);}
  const removeNote = (id) => setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
  const updateNote = (updatedNote) => setNotes((currentNotes) => currentNotes.map((note) => note.id === updatedNote.id ? updatedNote : note));
  const addFavourite = (note) => setFavourites((currentFavourites) => [...currentFavourites, note]);
  const removeFavourite = (id) => setFavourites((currentFavourites) => currentFavourites.filter((note) => note.id !== id));

  return (
    <NotesContext.Provider value={{ notes, addNote, removeNote, updateNote, favourites, addFavourite, removeFavourite }}>
      {children}
    </NotesContext.Provider>
  );
};
