import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import type { PlayerRecord } from '@/services/player-api';
import { formatStatValue } from '@/utils/format';

type Props = {
  playerRecord: PlayerRecord;
  onPress?: (p: PlayerRecord) => void;
};

export default function PlayerCard({ playerRecord, onPress }: Props) {
  const router = useRouter();
  const { player, player_id, passing, receiving, rushing } = playerRecord;

  async function handlePress() {
    if (onPress) return onPress(playerRecord);

    const targetId = player_id ?? null;
    console.log('PlayerCard pressed:', { targetId, playerRecord });
    console.log('PlayerCard router object:', router);
    if (!targetId) {
      console.warn('PlayerCard: no player id available to navigate');
      return;
    }

    const path = { pathname: '/player/[id]' as const, params: { id: String(targetId) } };
    console.log('PlayerCard navigating to', path);

    try {
      const res = await router.push(path);
      console.log('PlayerCard router.push resolved', res);
    } catch (err) {
      console.error('router.push failed, attempting replace', err);
      try {
        const res2 = await router.replace(path);
        console.log('PlayerCard router.replace resolved', res2);
      } catch (err2) {
        console.error('router.replace also failed', err2);
      }
    }
  }

  let statVal: number | null = null;
  let statLabel = '';

  if (player.position_group === 'QB' && passing) {
    statVal = passing.yards;
    statLabel = 'PASS YDS';
  } else if (player.position_group === 'WR' && receiving) {
    statVal = receiving.yards;
    statLabel = 'REC YDS';
  } else if (player.position_group === 'RB' && rushing) {
    statVal = rushing.yards;
    statLabel = 'RUSH YDS';
  }

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.row}>
        
        {player.headshot_url && (
          <Image source={{ uri: player.headshot_url }} style={styles.avatar} resizeMode="cover" />
        )}

        <View style={styles.infoContainer}>
          <ThemedText style={styles.name}>{player.display_name || player.name}</ThemedText>
          <View style={styles.metaRow}>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>{player.position}</ThemedText>
            </View>
            <ThemedText style={styles.seasonText}>Season {playerRecord.season}</ThemedText>
          </View>
        </View>

        {statVal !== null && (
          <View style={styles.statBox}>
            <ThemedText style={styles.statVal}>{formatStatValue(statVal)}</ThemedText>
            <ThemedText style={styles.statLabel}>{statLabel}</ThemedText>
          </View>
        )}

        <View style={styles.actionIndicator}>
          <ThemedText style={styles.arrow}>➔</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginVertical: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  cardPressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9' },
  infoContainer: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { color: '#0F172A', fontSize: 15, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  badge: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#475569', fontSize: 11, fontWeight: '700' },
  seasonText: { color: '#64748B', fontSize: 12, fontWeight: '500' },
  statBox: { alignItems: 'flex-end', marginRight: 12 },
  statVal: { color: '#0F172A', fontSize: 14, fontWeight: '700' },
  statLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '600' },
  actionIndicator: { justifyContent: 'center', alignItems: 'center' },
  arrow: { color: '#94A3B8', fontSize: 12 },
});
