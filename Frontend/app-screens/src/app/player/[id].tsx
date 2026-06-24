import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import PlayerGraphAnalysis from '@/components/player/PlayerGraphAnalysis';
import { ThemedText } from '@/components/themed-text';
import { getPlayerById, type PlayerRecord } from '@/services/player-api';
import { formatStatValue } from '@/utils/format';

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [history, setHistory] = useState<PlayerRecord[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<'season' | 'career'>('season');
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (!id) return;

    async function loadProfile() {
      console.log('[player-detail] loadProfile START', { id });
      try {
        setIsLoading(true);
        const data = await getPlayerById(id);
        console.log('[player-detail] getPlayerById returned', { length: data?.length });
        
        if (data && data.length > 0) {
          // Sort records descending by season year (e.g., 2022, 2021)
          const sorted = data.sort((a, b) => b.season - a.season);
          console.log('[player-detail] sorted seasons', sorted.map(s => s.season));
          setHistory(sorted);
          setSelectedIdx(0);
        } else {
          setErrorText('No historical records discovered.');
        }
      } catch (err) {
        setErrorText('Failed to pull profile data.');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.centeredShell}>
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  if (errorText || history.length === 0) {
    return (
      <View style={styles.centeredShell}>
        <ThemedText style={styles.errorText}>{errorText || 'Profile not found'}</ThemedText>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>Return to Index</ThemedText>
        </Pressable>
      </View>
    );
  }

  // Focus on the currently selected season slice
  const activeRecord = history[selectedIdx];
  const { player, passing, receiving, rushing, defense, kicking, fantasy } = activeRecord;
  const positionGroup = (player.position_group || '').toUpperCase();
  const isKicker = positionGroup === 'K' || positionGroup === 'SPEC' || (player.position || '').toUpperCase() === 'K';

  const hasPassing = passing && (passing.attempts > 0 || passing.yards > 0);
  const hasRushing = rushing && (rushing.carries > 0 || rushing.yards > 0);
  const hasReceiving = receiving && (receiving.targets > 0 || receiving.yards > 0);
  const hasDefense = defense && (defense.solo_tackles > 0 || defense.assist_tackles > 0 || defense.interceptions > 0);
  const hasKicking = kicking?.fg || kicking?.pat;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      
      {/* Navigation Headers */}
      <Pressable onPress={() => router.back()} style={styles.inlineBackRow}>
        <ThemedText style={styles.backArrow}>⇜ Back to Search</ThemedText>
      </Pressable>

      {/* Hero Header Area */}
      <View style={styles.heroCard}>
        {player.headshot_url && (
          <Image source={{ uri: player.headshot_url }} style={styles.heroAvatar} resizeMode="cover" />
        )}
        <ThemedText style={styles.heroName}>{player.display_name || player.name}</ThemedText>
        <View style={styles.badgeRow}>
          <View style={styles.positionBadge}>
            <ThemedText style={styles.positionText}>{player.position}</ThemedText>
          </View>
          <ThemedText style={styles.groupText}>Group: {player.position_group}</ThemedText>
        </View>
      </View>

      <View style={styles.modeSwitch}>
        <Pressable
          onPress={() => setSelectedTab('season')}
          style={[styles.modeTab, selectedTab === 'season' && styles.modeTabActive]}
        >
          <ThemedText style={[styles.modeTabText, selectedTab === 'season' && styles.modeTabTextActive]}>
            Season
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setSelectedTab('career')}
          style={[styles.modeTab, selectedTab === 'career' && styles.modeTabActive]}
        >
          <ThemedText style={[styles.modeTabText, selectedTab === 'career' && styles.modeTabTextActive]}>
            Career
          </ThemedText>
        </Pressable>
      </View>

      {selectedTab === 'season' ? (
        <>
          <View style={styles.seasonBar}>
            <ThemedText style={styles.barLabel}>Select Active Year:</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
              {history.map((rec, index) => (
                <Pressable
                  key={rec.season}
                  onPress={() => setSelectedIdx(index)}
                  style={[styles.tabItem, selectedIdx === index && styles.tabItemActive]}
                >
                  <ThemedText style={[styles.tabText, selectedIdx === index && styles.tabTextActive]}>
                    {rec.season}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.statsContainer}>
            {fantasy && (
              <View style={styles.block}>
                <ThemedText style={styles.blockTitle}>Fantasy Valuation</ThemedText>
                <View style={styles.grid}>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Standard</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(fantasy.standard)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>PPR Points</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(fantasy.ppr)}</ThemedText></View>
                </View>
              </View>
            )}

            {isKicker && hasKicking && (
              <View style={styles.block}>
                <ThemedText style={styles.blockTitle}>Kicking Metrics</ThemedText>
                <View style={styles.grid}>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>FG Made</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(kicking.fg?.made)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>FG Attempts</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(kicking.fg?.attempts)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>FG Missed</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(kicking.fg?.missed)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>FG Blocked</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(kicking.fg?.blocked)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>FG Long</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(kicking.fg?.long)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>FG %</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(kicking.fg?.pct)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>PAT Made</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(kicking.pat?.made)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>PAT Attempts</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(kicking.pat?.attempts)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>PAT %</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(kicking.pat?.pct)}</ThemedText></View>
                </View>
              </View>
            )}

            {!isKicker && hasPassing && (
              <View style={styles.block}>
                <ThemedText style={styles.blockTitle}>Passing Records</ThemedText>
                <View style={styles.grid}>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Yards</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(passing.yards)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Touchdowns</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(passing.tds)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Completions</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(passing.completions)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Attempts</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(passing.attempts)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Interceptions</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(passing.interceptions)}</ThemedText></View>
                </View>
              </View>
            )}

            {!isKicker && hasRushing && (
              <View style={styles.block}>
                <ThemedText style={styles.blockTitle}>Rushing Metrics</ThemedText>
                <View style={styles.grid}>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Yards</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(rushing.yards)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Touchdowns</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(rushing.tds)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Carries</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(rushing.carries)}</ThemedText></View>
                </View>
              </View>
            )}

            {!isKicker && hasReceiving && (
              <View style={styles.block}>
                <ThemedText style={styles.blockTitle}>Receiving Performance</ThemedText>
                <View style={styles.grid}>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Yards</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(receiving.yards)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Touchdowns</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(receiving.tds)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Receptions</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(receiving.receptions)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Targets</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(receiving.targets)}</ThemedText></View>
                </View>
              </View>
            )}

            {!isKicker && hasDefense && (
              <View style={styles.block}>
                <ThemedText style={styles.blockTitle}>Defensive Analytics</ThemedText>
                <View style={styles.grid}>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Solo Tackles</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(defense.solo_tackles)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Assists</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(defense.assist_tackles)}</ThemedText></View>
                  <View style={styles.gridCell}><ThemedText style={styles.cellLabel}>Interceptions</ThemedText><ThemedText style={styles.cellVal}>{formatStatValue(defense.interceptions)}</ThemedText></View>
                </View>
              </View>
            )}
          </View>
        </>
      ) : (
        <PlayerGraphAnalysis player={player} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContainer: { padding: 20, alignItems: 'center' },
  centeredShell: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 24 },
  errorText: { color: '#EF4444', fontSize: 15, fontWeight: '600', marginBottom: 16 },
  backButton: { backgroundColor: '#0F172A', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  backButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  inlineBackRow: { alignSelf: 'flex-start', marginBottom: 20 },
  backArrow: { color: '#64748B', fontSize: 14, fontWeight: '600' },
  heroCard: { width: '100%', maxWidth: 480, alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  heroAvatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#F1F5F9', marginBottom: 12 },
  heroName: { fontSize: 22, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  positionBadge: { backgroundColor: '#0F172A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  positionText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  groupText: { color: '#64748B', fontSize: 13, fontWeight: '500' },
  seasonBar: { width: '100%', maxWidth: 480, marginBottom: 20 },
  modeSwitch: {
    width: '100%',
    maxWidth: 480,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  modeTab: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeTabActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  modeTabText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  barLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  tabsScroll: { gap: 8 },
  tabItem: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  tabItemActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  tabText: { color: '#475569', fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#FFFFFF' },
  statsContainer: { width: '100%', maxWidth: 480, gap: 16 },
  block: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  blockTitle: { fontSize: 13, fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCell: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', borderWidth: 1, borderRadius: 8, padding: 10, minWidth: 100, flexGrow: 1 },
  cellLabel: { fontSize: 11, fontWeight: '500', color: '#94A3B8' },
  cellVal: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginTop: 2 },
});
