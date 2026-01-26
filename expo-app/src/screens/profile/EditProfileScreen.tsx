import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';

export default function EditProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const { userProfile, updateProfile } = useUser();
  const [name, setName] = useState(userProfile?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom ne peut pas être vide');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ name });
      Alert.alert('Succès', 'Profil mis à jour');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
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
        <Text style={styles.title}>Modifier le profil</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Save size={24} color={loading ? 'rgba(28, 25, 23, 0.40)' : '#F59E0B'} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Votre nom"
                placeholderTextColor="rgba(28, 25, 23, 0.40)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={userProfile?.email || ''}
                editable={false}
              />
              <Text style={styles.hint}>L'email ne peut pas être modifié</Text>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
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
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: 'rgba(28, 25, 23, 0.95)', marginLeft: 4 },
  input: { backgroundColor: '#FDFCFB', borderRadius: 12, padding: 16, fontSize: 16, color: 'rgba(28, 25, 23, 0.95)', borderWidth: 0.5, borderColor: 'rgba(120, 113, 108, 0.10)' },
  inputDisabled: { backgroundColor: '#EAE7E3', color: 'rgba(28, 25, 23, 0.50)' },
  hint: { fontSize: 12, color: 'rgba(28, 25, 23, 0.50)', marginLeft: 4 },
  saveButton: { backgroundColor: '#F59E0B', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
