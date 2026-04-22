import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

interface Note {
  id: number;
  title: string;
  content: string;
  isImportant: number;
}

interface NoteItemProps {
  note: Note;
  onDelete: (id: number) => Promise<void>;
}

export default function NoteItem({ note, onDelete }: NoteItemProps) {
  const handleDelete = () => {
    Alert.alert(
      'Eliminar nota',
      '¿Estás seguro que deseas eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(note.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, note.isImportant === 1 && styles.importantCard]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {note.title}
          {note.isImportant === 1 && ' ⭐'}
        </Text>
      </View>
      <Text style={styles.content}>{note.content}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="🗑️ Eliminar"
          onPress={handleDelete}
          color="#ff6b6b"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  importantCard: {
    borderColor: '#FFD700',
    borderWidth: 2,
    backgroundColor: '#fffaf0',
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  content: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
