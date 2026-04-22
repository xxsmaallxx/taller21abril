import { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  Switch,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NoteItem from '@/components/NoteItem';
import { getNotes, insertNote, deleteNote, getPreferences, Note, Preference } from '@/db/database';

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [preferences, setPreferences] = useState<Preference | null>(null);
  const [isImportant, setIsImportant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const allNotes = await getNotes();
      const prefs = await getPreferences();
      setNotes(allNotes);
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    if (!preferences) return;

    let data = [...notes];

    if (preferences.showOnlyImportant === 1) {
      data = data.filter((n) => n.isImportant === 1);
    }

    if (search) {
      data = data.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (preferences.sortBy === 'alphabetical') {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      data.sort((a, b) => b.id - a.id);
    }

    setFilteredNotes(data);
  }, [notes, search, preferences]);

  const addNote = async () => {
    if (!title.trim()) {
      alert('Por favor ingresa un título');
      return;
    }
    await insertNote(title, content, isImportant);
    setTitle('');
    setContent('');
    setIsImportant(false);
    await loadData();
  };

  const removeNote = async (id: number) => {
    await deleteNote(id);
    await loadData();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando notas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 Mis Notas</Text>

      <TextInput
        placeholder="🔍 Buscar notas..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nueva Nota:</Text>

        <TextInput
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
          style={[styles.input, styles.titleInput]}
          placeholderTextColor="#888"
        />

        <TextInput
          placeholder="Contenido"
          value={content}
          onChangeText={setContent}
          style={[styles.input, styles.contentInput]}
          placeholderTextColor="#888"
          multiline
        />

        <View style={styles.importantContainer}>
          <Text>Marcar como importante ⭐</Text>
          <Switch value={isImportant} onValueChange={setIsImportant} />
        </View>

        <Button title="+ Agregar Nota" onPress={addNote} color="#4CAF50" />
      </View>

      <Text style={styles.notesCount}>
        {filteredNotes.length} nota{filteredNotes.length !== 1 ? 's' : ''}
      </Text>

      {filteredNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay notas para mostrar</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NoteItem note={item} onDelete={removeNote} />
          )}
          scrollEnabled={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  titleInput: {
    fontWeight: 'bold',
  },
  contentInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  importantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  notesCount: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
