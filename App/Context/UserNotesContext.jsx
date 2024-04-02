import React, { createContext, useContext, useState, useEffect } from'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotesContext = createContext();

const usePersistedState = (key, defaultValue) => {
    const [state, setState] = useState(defaultValue);

    useEffect(() => {
      (async () => {
        const savedState = await AsyncStorage.getItem(key);
        if (savedState) {
          setState(JSON.parse(savedState));
        }
      })();
    }, [key]);

    useEffect(() => {
      AsyncStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    console.log(state);
    return [state, setState];
};

// Create a Provider Component
export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = usePersistedState('notes', []);

    const addNote = (note) => {
        setNotes([...notes, note]);
    };
    const removeNote = (id) => {
        setNotes(notes.filter(note => note.id!== id));
    };
    const updateNote = (id, note) => {
        setNotes(notes.map(note => note.id === id? note : note));
    };

    return (
        <NotesContext.Provider value={{ notes, setNotes }}>
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    return useContext(NotesContext);
};
