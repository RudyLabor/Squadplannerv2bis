import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Edit, LogOut, Crown, TrendingUp, Target, Award } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';

export default function ProfileScreen({ navigation }: any) {
  const { signOut } = useAuth();
  const { userProfile } = useUser();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: () => signOut() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Edit size={24} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={48} color="#F59E0B" />
          </View>
          <Text style={styles.name}>{userProfile?.name || 'Gamer'}</Text>
          <Text style={styles.email}>{userProfile?.email || ''}</Text>
          
          {userProfile?.isPremium && (
            <View style={styles.premiumBadge}>
              <Crown size={16} color="#F59E0B" />
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{userProfile?.reliabilityScore || 0}%</Text>
              <Text style={styles.statLabel}>Fiabilité</Text>
            </View>
            <View style={styles.statCard}>
              <Target size={24} color="#14B8A6" />
              <Text style={styles.statValue}>{userProfile?.level || 1}</Text>
              <Text style={styles.statLabel}>Niveau</Text>
            </View>
            <View style={styles.statCard}>
              <Award size={24} color="#10B981" />
              <Text style={styles.statValue}>{userProfile?.xp || 0}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditProfile')}>
            <Edit size={20} color="rgba(28, 25, 23, 0.95)" />
            <Text style={styles.actionText}>Modifier mon profil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <LogOut size={20} color="#F43F5E" />
            <Text style={[styles.actionText, styles.logoutText]}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: '700', color: 'rgba(28, 25, 23, 0.95)' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  profileCard: { backgroundColor: '#FDFCFB', borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(120, 113, 108, 0.10)', marginBottom: 24 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#FFFBEB', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  name: { fontSize: 24, fontWeight: '700', color: 'rgba(28, 25, 23, 0.95)', marginBottom: 4 },
  email: { fontSize: 14, color: 'rgba(28, 25, 23, 0.70)', marginBottom: 12 },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFBEB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 0.5, borderColor: '#F59E0B' },
  premiumText: { fontSize: 12, fontWeight: '700', color: '#F59E0B', letterSpacing: 0.5 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: 'rgba(28, 25, 23, 0.95)', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FDFCFB', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(120, 113, 108, 0.10)' },
  statValue: { fontSize: 24, fontWeight: '700', color: 'rgba(28, 25, 23, 0.95)', marginTop: 8 },
  statLabel: { fontSize: 12, color: 'rgba(28, 25, 23, 0.70)', marginTop: 4 },
  actionButton: { backgroundColor: '#FDFCFB', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 0.5, borderColor: 'rgba(120, 113, 108, 0.10)', marginBottom: 12 },
  actionText: { fontSize: 16, fontWeight: '600', color: 'rgba(28, 25, 23, 0.95)' },
  logoutButton: { backgroundColor: '#FFF1F2', borderColor: '#F43F5E' },
  logoutText: { color: '#F43F5E' },
});
