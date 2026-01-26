import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Users, CheckCircle, XCircle, Plus } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

export default function SessionsScreen({ navigation }: any) {
  const { accessToken } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const loadSessions = async () => {
    if (!accessToken) return;
    try {
      const data = await api.getSessions(accessToken);
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [accessToken]);

  const handleRSVP = async (sessionId: string, status: 'yes' | 'no') => {
    if (!accessToken) return;
    try {
      await api.rsvpSession(accessToken, sessionId, status);
      loadSessions();
    } catch (error) {
      console.error('Error RSVP:', error);
    }
  };

  const upcomingSessions = sessions.filter(s => new Date(s.datetime) > new Date());
  const pastSessions = sessions.filter(s => new Date(s.datetime) <= new Date());
  const displaySessions = filter === 'upcoming' ? upcomingSessions : pastSessions;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Sessions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ProposeSession')}>
          <Plus size={28} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'upcoming' && styles.filterButtonActive]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>
            À venir ({upcomingSessions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'past' && styles.filterButtonActive]}
          onPress={() => setFilter('past')}
        >
          <Text style={[styles.filterText, filter === 'past' && styles.filterTextActive]}>
            Passées ({pastSessions.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadSessions(); }} />}
      >
        {displaySessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={64} color="rgba(28, 25, 23, 0.25)" />
            <Text style={styles.emptyTitle}>Aucune session</Text>
            <Text style={styles.emptyText}>
              {filter === 'upcoming' ? 'Proposez un créneau pour commencer' : 'Aucune session passée'}
            </Text>
          </View>
        ) : (
          <View style={styles.sessionsList}>
            {displaySessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionGame}>{session.game || 'Session'}</Text>
                  {session.status && (
                    <View style={[styles.statusBadge, session.status === 'confirmed' && styles.statusConfirmed]}>
                      <Text style={styles.statusText}>{session.status === 'confirmed' ? 'Confirmée' : 'En attente'}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.sessionInfo}>
                  <View style={styles.infoRow}>
                    <Calendar size={16} color="rgba(28, 25, 23, 0.70)" />
                    <Text style={styles.infoText}>
                      {new Date(session.datetime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Clock size={16} color="rgba(28, 25, 23, 0.70)" />
                    <Text style={styles.infoText}>
                      {new Date(session.datetime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  {session.squad && (
                    <View style={styles.infoRow}>
                      <Users size={16} color="rgba(28, 25, 23, 0.70)" />
                      <Text style={styles.infoText}>{session.squad.name}</Text>
                    </View>
                  )}
                </View>

                {filter === 'upcoming' && (
                  <View style={styles.rsvpButtons}>
                    <TouchableOpacity
                      style={[styles.rsvpButton, styles.rsvpYes]}
                      onPress={() => handleRSVP(session.id, 'yes')}
                    >
                      <CheckCircle size={18} color="#10B981" />
                      <Text style={styles.rsvpYesText}>Je suis partant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.rsvpButton, styles.rsvpNo]}
                      onPress={() => handleRSVP(session.id, 'no')}
                    >
                      <XCircle size={18} color="#F43F5E" />
                      <Text style={styles.rsvpNoText}>Pas dispo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
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
  filters: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 16 },
  filterButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#FDFCFB', borderWidth: 0.5, borderColor: 'rgba(120, 113, 108, 0.10)', alignItems: 'center' },
  filterButtonActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  filterText: { fontSize: 14, fontWeight: '600', color: 'rgba(28, 25, 23, 0.70)' },
  filterTextActive: { color: '#FFFFFF' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  emptyState: { backgroundColor: '#FDFCFB', borderRadius: 16, padding: 48, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(120, 113, 108, 0.10)' },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: 'rgba(28, 25, 23, 0.95)', marginTop: 16 },
  emptyText: { fontSize: 14, color: 'rgba(28, 25, 23, 0.70)', marginTop: 8, textAlign: 'center' },
  sessionsList: { gap: 16 },
  sessionCard: { backgroundColor: '#FDFCFB', borderRadius: 16, padding: 20, borderWidth: 0.5, borderColor: 'rgba(120, 113, 108, 0.10)' },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sessionGame: { fontSize: 18, fontWeight: '700', color: 'rgba(28, 25, 23, 0.95)' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: '#FFF7ED' },
  statusConfirmed: { backgroundColor: '#ECFDF5' },
  statusText: { fontSize: 12, fontWeight: '600', color: '#F97316' },
  sessionInfo: { gap: 8, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: 'rgba(28, 25, 23, 0.70)' },
  rsvpButtons: { flexDirection: 'row', gap: 12, paddingTop: 16, borderTopWidth: 0.5, borderTopColor: 'rgba(120, 113, 108, 0.10)' },
  rsvpButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12 },
  rsvpYes: { backgroundColor: '#ECFDF5', borderWidth: 0.5, borderColor: '#10B981' },
  rsvpNo: { backgroundColor: '#FFF1F2', borderWidth: 0.5, borderColor: '#F43F5E' },
  rsvpYesText: { fontSize: 14, fontWeight: '600', color: '#10B981' },
  rsvpNoText: { fontSize: 14, fontWeight: '600', color: '#F43F5E' },
});
