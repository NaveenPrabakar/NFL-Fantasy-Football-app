import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import PlayerCard from '@/components/search/PlayerCard';
import { getPlayerById } from '@/services/player-api';

export default function PlayerDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [player, setPlayer] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const p = await getPlayerById(id as string);
      setPlayer(p);
    })();
  }, [id]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>Player</ThemedText>
          <ThemedText style={styles.title}>{player?.name ?? 'Loading...'}</ThemedText>
        </View>

        <View style={styles.cardWrap}>
          {player ? (
            <>
              <PlayerCard player={player} />
              <View style={styles.stats}>
                <ThemedText style={styles.statTitle}>Stats</ThemedText>
                {player.stats ? (
                  Object.entries(player.stats).map(([k, v]) => (
                    <View key={k} style={styles.statRow}>
                      <ThemedText style={styles.statLabel}>{k}</ThemedText>
                      <ThemedText style={styles.statValue}>{String(v)}</ThemedText>
                    </View>
                  ))
                ) : (
                  <ThemedText style={styles.empty}>No stats available.</ThemedText>
                )}
              </View>
            </>
          ) : (
            <ThemedText style={styles.empty}>Loading player...</ThemedText>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FB' },
  content: { padding: 20, alignItems: 'center' },
  header: { width: '100%', maxWidth: 760, gap: 8, marginBottom: 8 },
  eyebrow: { color: '#4B6BFB', fontSize: 13, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: '#111827', fontSize: 28, fontWeight: '800' },
  cardWrap: { width: '100%', maxWidth: 760 },
  stats: { marginTop: 12, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8, borderColor: '#E5EAF2', borderWidth: 1 },
  statTitle: { fontWeight: '800', fontSize: 16, marginBottom: 8 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  statLabel: { color: '#5F6B7A' },
  statValue: { color: '#111827', fontWeight: '700' },
  empty: { color: '#5F6B7A', padding: 12 },
});
