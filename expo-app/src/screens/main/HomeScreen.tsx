import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Calendar, Plus, TrendingUp } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { api } from '../../utils/api';

export default function HomeScreen({ navigation }: any) {
  const { accessToken } = useAuth();
  const { userProfile } = useUser();
  const [squads, setSquads] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!accessToken) return;

    try {
      const [squadsData, sessionsData] = await Promise.all([
        api.getSquads(accessToken),
        api.getSessions(accessToken),
      ]);

      setSquads(squadsData.squads || []);
      setSessions(sessionsData.sessions || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [accessToken]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const nextSession = sessions.find((s) => new Date(s.datetime) > new Date());

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Salut, {userProfile?.name || 'Gamer'} 👋</Text>
            <Text style={styles.subtitle}>Prêt à jouer ?</Text>
          </View>
          {userProfile?.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          )}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#F59E0B" />
            <Text style={styles.statValue}>{userProfile?.reliabilityScore || 0}%</Text>
            <Text style={styles.statLabel}>Fiabilité</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={20} color="#14B8A6" />
            <Text style={styles.statValue}>{squads.length}</Text>
            <Text style={styles.statLabel}>Squads</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={20} color="#10B981" />
            <Text style={styles.statValue}>{sessions.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>

        {/* Next Session */}
        {nextSession && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Prochaine session</Text>
            <View style={styles.sessionCard}>
              <Text style={styles.sessionGame}>{nextSession.game || 'Session'}</Text>
              <Text style={styles.sessionDate}>
                {new Date(nextSession.datetime).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        )}

        {/* My Squads */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes squads</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CreateSquad')}>
              <Plus size={24} color="#F59E0B" />
            </TouchableOpacity>
          </View>

          {squads.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={48} color="rgba(28, 25, 23, 0.25)" />
              <Text style={styles.emptyText}>Aucune squad</Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateSquad')}
              >
                <Text style={styles.createButtonText}>Créer une squad</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.squadsList}>
              {squads.slice(0, 3).map((squad) => (
                <TouchableOpacity
                  key={squad.id}
                  style={styles.squadCard}
                  onPress={() => navigation.navigate('SquadDetail', { squadId: squad.id })}
                >
                  <Text style={styles.squadName}>{squad.name}</Text>
                  <Text style={styles.squadMembers}>{squad.memberCount || 0} membres</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ProposeSession')}
            >
              <Calendar size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Proposer un créneau</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: 'rgba(28, 25, 23, 0.95)',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(28, 25, 23, 0.70)',
    marginTop: 4,
  },
  premiumBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FDFCFB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(120, 113, 108, 0.10)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(28, 25, 23, 0.95)',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(28, 25, 23, 0.70)',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FDFCFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(120, 113, 108, 0.10)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(28, 25, 23, 0.95)',
    marginBottom: 12,
  },
  sessionCard: {
    gap: 8,
  },
  sessionGame: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(28, 25, 23, 0.95)',
  },
  sessionDate: {
    fontSize: 14,
    color: 'rgba(28, 25, 23, 0.70)',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(28, 25, 23, 0.95)',
  },
  emptyState: {
    backgroundColor: '#FDFCFB',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(120, 113, 108, 0.10)',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(28, 25, 23, 0.70)',
    marginTop: 12,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  squadsList: {
    gap: 12,
  },
  squadCard: {
    backgroundColor: '#FDFCFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(120, 113, 108, 0.10)',
  },
  squadName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(28, 25, 23, 0.95)',
    marginBottom: 4,
  },
  squadMembers: {
    fontSize: 14,
    color: 'rgba(28, 25, 23, 0.70)',
  },
  quickActions: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
