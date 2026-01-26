import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Users } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

export default function CreateSquadScreen({ navigation }: any) {
  const { accessToken } = useAuth();
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom de la squad est requis');
      return;
    }

    setLoading(true);
    try {
      await api.createSquad(accessToken!, { name, game, description });
      Alert.alert('Succès', 'Squad créée avec succès');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la squad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="rgba(28, 25, 23, 0.95)" />
        </TouchableOpacity>
        <Text style={styles.title}>Nouvelle squad</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.iconContainer}>
            <Users size={48} color="#F59E0B" />
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom de la squad *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Les Légendes"
                placeholderTextColor="rgba(28, 25, 23, 0.40)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Jeu principal</Text>
              <TextInput
                style={styles.input}
                value={game}
                onChangeText={setGame}
                placeholder="Valorant, League of Legends..."
                placeholderTextColor="rgba(28, 25, 23, 0.40)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Une description de votre squad..."
                placeholderTextColor="rgba(28, 25, 23, 0.40)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.createButton, loading && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={loading}
            >
              <Text style={styles.createButtonText}>
                {loading ? 'Création...' : 'Créer la squad'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 18, fontWeight: '700', color: 'rgba(28, 25, 23, 0.95)' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  iconContainer: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#FDFCFB', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 32 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: 'rgba(28, 25, 23, 0.95)', marginLeft: 4 },
  input: { backgroundColor: '#FDFCFB', borderRadius: 12, padding: 16, fontSize: 16, color: 'rgba(28, 25, 23, 0.95)', borderWidth: 0.5, borderColor: 'rgba(120, 113, 108, 0.10)' },
  textArea: { minHeight: 120 },
  createButton: { backgroundColor: '#F59E0B', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
