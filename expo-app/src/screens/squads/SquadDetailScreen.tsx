import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Users, Calendar, Settings } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

export default function SquadDetailScreen({ route, navigation }: any) {
  const { squadId } = route.params;
  const { accessToken } = useAuth();
  const [squad, setSquad] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSquad = async () => {
      if (!accessToken) return;
      try {
        const data = await api.getSquad(accessToken, squadId);
        setSquad(data.squad);
      } catch (error) {
        console.error('Error loading squad:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSquad();
  }, [squadId, accessToken]);

  if (!squad) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="rgba(28, 25, 23, 0.95)" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Settings size={24} color="rgba(28, 25, 23, 0.95)" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.squadHeader}>
          <Text style={styles.squadName}>{squad.name}</Text>
          {squad.game && <Text style={styles.squadGame}>{squad.game}</Text>}
        </View>

        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Membres ({squad.members?.length || 0})</Text>
          <View style={styles.membersList}>
            {squad.members?.map((member: any) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberAvatar}>
                  <Users size={20} color="#F59E0B" />
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role || 'Membre'}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.createSessionButton}
          onPress={() => navigation.navigate('ProposeSession', { squadId: squad.id })}
        >
          <Calendar size={20} color="#FFFFFF" />
          <Text style={styles.createSessionText}>Proposer un créneau</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  squadHeader: { marginBottom: 32 },
  squadName: { fontSize: 32, fontWeight: '700', color: 'rgba(28, 25, 23, 0.95)', marginBottom: 8 },
  squadGame: { fontSize: 16, color: 'rgba(28, 25, 23, 0.70)' },
  membersSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: 'rgba(28, 25, 23, 0.95)', marginBottom: 16 },
  membersList: { gap: 12 },
  memberCard: { backgroundColor: '#FDFCFB', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 0.5, borderColor: 'rgba(120, 113, 108, 0.10)' },
  memberAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFBEB', alignItems: 'center', justifyContent: 'center' },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 16, fontWeight: '600', color: 'rgba(28, 25, 23, 0.95)' },
  memberRole: { fontSize: 14, color: 'rgba(28, 25, 23, 0.70)' },
  createSessionButton: { backgroundColor: '#F59E0B', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  createSessionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
