import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

export default function ProposeSessionScreen({ route, navigation }: any) {
  const { squadId } = route.params || {};
  const { accessToken } = useAuth();
  const [game, setGame] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!game.trim() || !datetime.trim()) {
      Alert.alert('Erreur', 'Le jeu et la date/heure sont requis');
      return;
    }

    setLoading(true);
    try {
      await api.createSession(accessToken!, { game, datetime, description, squadId });
      Alert.alert('Succès', 'Session proposée avec succès');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la session');
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
        <Text style={styles.title}>Proposer un créneau</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.iconContainer}>
            <Calendar size={48} color="#F59E0B" />
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Jeu *</Text>
              <TextInput
                style={styles.input}
                value={game}
                onChangeText={setGame}
                placeholder="Valorant, League of Legends..."
                placeholderTextColor="rgba(28, 25, 23, 0.40)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date et heure *</Text>
              <TextInput
                style={styles.input}
                value={datetime}
                onChangeText={setDatetime}
                placeholder="2026-01-30 20:00"
                placeholderTextColor="rgba(28, 25, 23, 0.40)"
              />
              <Text style={styles.hint}>Format: YYYY-MM-DD HH:MM</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Détails de la session..."
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
                {loading ? 'Création...' : 'Proposer'}
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
  hint: { fontSize: 12, color: 'rgba(28, 25, 23, 0.50)', marginLeft: 4 },
  createButton: { backgroundColor: '#F59E0B', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
