import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: number;
  title: string;
  content: string;
  isImportant: number;
}

export interface Preference {
  id: number;
  showOnlyImportant: number;
  sortBy: string;
}

const NOTES_KEY = '@notes_app/notes';
const PREFERENCES_KEY = '@notes_app/preferences';

// Inicializar base de datos
export const initDB = async () => {
  try {
    // Verificar si existen preferencias
    const prefsStr = await AsyncStorage.getItem(PREFERENCES_KEY);
    
    if (!prefsStr) {
      // Crear preferencias por defecto
      const defaultPrefs: Preference = {
        id: 1,
        showOnlyImportant: 0,
        sortBy: 'date',
      };
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify([defaultPrefs]));
    }

    // Inicializar notas si no existen
    const notesStr = await AsyncStorage.getItem(NOTES_KEY);
    if (!notesStr) {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify([]));
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const getNotes = async (): Promise<Note[]> => {
  try {
    const notesStr = await AsyncStorage.getItem(NOTES_KEY);
    return notesStr ? JSON.parse(notesStr) : [];
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

export const insertNote = async (title: string, content: string, isImportant: boolean) => {
  try {
    const notes = await getNotes();
    const newNote: Note = {
      id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
      title,
      content,
      isImportant: isImportant ? 1 : 0,
    };
    notes.push(newNote);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    console.log('Note inserted:', newNote);
  } catch (error) {
    console.error('Error inserting note:', error);
  }
};

export const deleteNote = async (id: number) => {
  try {
    const notes = await getNotes();
    const filtered = notes.filter(n => n.id !== id);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
    console.log('Note deleted:', id);
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

export const getPreferences = async (): Promise<Preference> => {
  try {
    const prefsStr = await AsyncStorage.getItem(PREFERENCES_KEY);
    if (prefsStr) {
      const prefs = JSON.parse(prefsStr);
      return prefs[0] || { id: 1, showOnlyImportant: 0, sortBy: 'date' };
    }
    return { id: 1, showOnlyImportant: 0, sortBy: 'date' };
  } catch (error) {
    console.error('Error getting preferences:', error);
    return { id: 1, showOnlyImportant: 0, sortBy: 'date' };
  }
};

export const updatePreferences = async (showOnlyImportant: boolean, sortBy: string) => {
  try {
    const prefs: Preference = {
      id: 1,
      showOnlyImportant: showOnlyImportant ? 1 : 0,
      sortBy,
    };
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify([prefs]));
    console.log('Preferences updated:', prefs);
  } catch (error) {
    console.error('Error updating preferences:', error);
  }
};
