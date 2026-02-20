import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, CodeSnippet } from './types';

interface NotesContextType {
  notes: Note[];
  codeSnippets: CodeSnippet[];
  getNotesByTopic: (topicId: string) => Note[];
  getCodeSnippetsByTopic: (topicId: string) => CodeSnippet[];
  addNote: (note: Note) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  addCodeSnippet: (snippet: CodeSnippet) => Promise<void>;
  updateCodeSnippet: (snippet: CodeSnippet) => Promise<void>;
  deleteCodeSnippet: (snippetId: string) => Promise<void>;
  isLoading: boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

interface State {
  notes: Note[];
  codeSnippets: CodeSnippet[];
  isLoading: boolean;
}

type Action =
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'SET_CODE_SNIPPETS'; payload: CodeSnippet[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_CODE_SNIPPET'; payload: CodeSnippet }
  | { type: 'UPDATE_CODE_SNIPPET'; payload: CodeSnippet }
  | { type: 'DELETE_CODE_SNIPPET'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

function notesReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_CODE_SNIPPETS':
      return { ...state, codeSnippets: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((n) => (n.id === action.payload.id ? action.payload : n)),
      };
    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter((n) => n.id !== action.payload) };
    case 'ADD_CODE_SNIPPET':
      return { ...state, codeSnippets: [...state.codeSnippets, action.payload] };
    case 'UPDATE_CODE_SNIPPET':
      return {
        ...state,
        codeSnippets: state.codeSnippets.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case 'DELETE_CODE_SNIPPET':
      return {
        ...state,
        codeSnippets: state.codeSnippets.filter((s) => s.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notesReducer, {
    notes: [],
    codeSnippets: [],
    isLoading: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [notesJson, snippetsJson] = await Promise.all([
        AsyncStorage.getItem('notes'),
        AsyncStorage.getItem('code_snippets'),
      ]);

      if (notesJson) {
        const notes = JSON.parse(notesJson);
        dispatch({ type: 'SET_NOTES', payload: notes });
      }

      if (snippetsJson) {
        const snippets = JSON.parse(snippetsJson);
        dispatch({ type: 'SET_CODE_SNIPPETS', payload: snippets });
      }
    } catch (error) {
      console.error('Error loading notes data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getNotesByTopic = (topicId: string): Note[] => {
    return state.notes.filter((n) => n.topicId === topicId);
  };

  const getCodeSnippetsByTopic = (topicId: string): CodeSnippet[] => {
    return state.codeSnippets.filter((s) => s.topicId === topicId);
  };

  const addNote = async (note: Note) => {
    try {
      dispatch({ type: 'ADD_NOTE', payload: note });
      const updatedNotes = [...state.notes, note];
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateNote = async (note: Note) => {
    try {
      dispatch({ type: 'UPDATE_NOTE', payload: note });
      const updatedNotes = state.notes.map((n) => (n.id === note.id ? note : n));
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      dispatch({ type: 'DELETE_NOTE', payload: noteId });
      const updatedNotes = state.notes.filter((n) => n.id !== noteId);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const addCodeSnippet = async (snippet: CodeSnippet) => {
    try {
      dispatch({ type: 'ADD_CODE_SNIPPET', payload: snippet });
      const updatedSnippets = [...state.codeSnippets, snippet];
      await AsyncStorage.setItem('code_snippets', JSON.stringify(updatedSnippets));
    } catch (error) {
      console.error('Error adding code snippet:', error);
    }
  };

  const updateCodeSnippet = async (snippet: CodeSnippet) => {
    try {
      dispatch({ type: 'UPDATE_CODE_SNIPPET', payload: snippet });
      const updatedSnippets = state.codeSnippets.map((s) =>
        s.id === snippet.id ? snippet : s
      );
      await AsyncStorage.setItem('code_snippets', JSON.stringify(updatedSnippets));
    } catch (error) {
      console.error('Error updating code snippet:', error);
    }
  };

  const deleteCodeSnippet = async (snippetId: string) => {
    try {
      dispatch({ type: 'DELETE_CODE_SNIPPET', payload: snippetId });
      const updatedSnippets = state.codeSnippets.filter((s) => s.id !== snippetId);
      await AsyncStorage.setItem('code_snippets', JSON.stringify(updatedSnippets));
    } catch (error) {
      console.error('Error deleting code snippet:', error);
    }
  };

  const value: NotesContextType = {
    notes: state.notes,
    codeSnippets: state.codeSnippets,
    getNotesByTopic,
    getCodeSnippetsByTopic,
    addNote,
    updateNote,
    deleteNote,
    addCodeSnippet,
    updateCodeSnippet,
    deleteCodeSnippet,
    isLoading: state.isLoading,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
