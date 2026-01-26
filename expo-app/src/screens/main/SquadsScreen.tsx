import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Plus, Search } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

export default function SquadsScreen({ navigation }: any) {
  const { accessToken } = useAuth();
  const [squads, setSquads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSquads = async () => {
    if (!accessToken) return;
    try {
      const data = await api.getSquads(accessToken);
      setSquads(data.squads || []);
    } catch (error) {
      console.error('Error loading squads:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSquads();
  }, [accessToken]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Squads</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateSquad')}>
          <Plus size={28} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadSquads(); }} />}
      >
        {squads.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={64} color="rgba(28, 25, 23, 0.25)" />
            <Text style={styles.emptyTitle}>Aucune squad</Text>
            <Text style={styles.emptyText}>Créez votre première squad pour commencer</Text>
            <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateSquad')}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Créer une squad</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.squadsList}>
            {squads.map((squad) => (
              <TouchableOpacity
                key={squad.id}
                style={styles.squadCard}
                onPress={() => navigation.navigate('SquadDetail', { squadId: squad.id })}
              >
                <View style={styles.squadHeader}>
                  <Text style={styles.squadName}>{squad.name}</Text>
                  <View style={styles.memberCount}>
                    <Users size={16} color="#F59E0B" />
                    <Text style={styles.memberCountText}>{squad.memberCount || 0}</Text>
                  </View>
                </View>
                {squad.game && <Text style={styles.squadGame}>{squad.game}</Text>}
                {squad.nextSession && (
                  <View style={styles.nextSession}>
                    <Text style={styles.nextSessionLabel}>Prochaine session :</Text>
                    <Text style={styles.nextSessionDate}>{new Date(squad.nextSession).toLocaleDateString('fr-FR')}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: '700', color: 'rgba(28, 25, 23, 0.95)' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  emptyState: { backgroundColor: '#FDFCFB', borderRadius: 16, padding: 48, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(120, 113, 108, 0.10)' },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: 'rgba(28, 25, 23, 0.95)', marginTop: 16 },
  emptyText: { fontSize: 14, color: 'rgba(28, 25, 23, 0.70)', marginTop: 8, textAlign: 'center' },
  createButton: { backgroundColor: '#F59E0B', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24 },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  squadsList: { gap: 16 },
  squadCard: { backgroundColor: '#FDFCFB', borderRadius: 16, padding: 20, borderWidth: 0.5, borderColor: 'rgba(120, 113, 108, 0.10)' },
  squadHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  squadName: { fontSize: 18, fontWeight: '700', color: 'rgba(28, 25, 23, 0.95)' },
  memberCount: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFBEB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  memberCountText: { fontSize: 14, fontWeight: '600', color: '#F59E0B' },
  squadGame: { fontSize: 14, color: 'rgba(28, 25, 23, 0.70)', marginBottom: 12 },
  nextSession: { paddingTop: 12, borderTopWidth: 0.5, borderTopColor: 'rgba(120, 113, 108, 0.10)' },
  nextSessionLabel: { fontSize: 12, color: 'rgba(28, 25, 23, 0.70)' },
  nextSessionDate: { fontSize: 14, fontWeight: '600', color: 'rgba(28, 25, 23, 0.95)', marginTop: 4 },
});
