import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getPreferences, updatePreferences, getNotes } from '@/db/database';

export default function SettingsScreen() {
  const [onlyImportant, setOnlyImportant] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [totalNotes, setTotalNotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const prefs = await getPreferences();
      setOnlyImportant(prefs.showOnlyImportant === 1);
      setSortBy(prefs.sortBy);
      const notes = await getNotes();
      setTotalNotes(notes.length);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
    }, [loadPreferences])
  );

  const savePreferences = async () => {
    await updatePreferences(onlyImportant, sortBy);
    Alert.alert('✅ Guardado', 'Las preferencias se han guardado exitosamente');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando configuración...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>⚙️ Configuración</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📊 Total de notas: {totalNotes}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filtros</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Mostrar solo notas importantes</Text>
            <Text style={styles.settingDescription}>
              {onlyImportant ? '✓ Activado' : '○ Desactivado'}
            </Text>
          </View>
          <Switch
            value={onlyImportant}
            onValueChange={setOnlyImportant}
            trackColor={{ false: '#d3d3d3', true: '#81c784' }}
            thumbColor={onlyImportant ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ordenamiento</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Orden de notas:</Text>
        </View>

        <View style={styles.buttonGroup}>
          <Button
            title={sortBy === 'date' ? '📅 Por Fecha (Activo)' : '📅 Por Fecha'}
            onPress={() => setSortBy('date')}
            color={sortBy === 'date' ? '#4CAF50' : '#2196F3'}
          />
        </View>

        <View style={styles.buttonGroup}>
          <Button
            title={
              sortBy === 'alphabetical'
                ? '🔤 Alfabético (Activo)'
                : '🔤 Alfabético'
            }
            onPress={() => setSortBy('alphabetical')}
            color={sortBy === 'alphabetical' ? '#4CAF50' : '#2196F3'}
          />
        </View>

        <Text style={styles.helpText}>
          • Por Fecha: Notas más recientes primero
          {'\n'}• Alfabético: Ordenadas por título (A-Z)
        </Text>
      </View>

      <View style={styles.section}>
        <Button
          title="💾 Guardar Cambios"
          onPress={savePreferences}
          color="#4CAF50"
          accessibilityLabel="Guardar cambios de preferencias"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acerca de</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📝 App de Notas v1.0{'\n'}
            {'\n'}
            Características:{'\n'}
            • Crear, editar y eliminar notas{'\n'}
            • Marcar notas como importantes{'\n'}
            • Búsqueda en tiempo real{'\n'}
            • Filtrado y ordenamiento personalizado
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  buttonGroup: {
    marginVertical: 8,
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
