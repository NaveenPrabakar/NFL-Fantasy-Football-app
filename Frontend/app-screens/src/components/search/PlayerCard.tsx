import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { SymbolView } from 'expo-symbols';

type Player = {
  id?: string | number;
  name: string;
  team?: string;
  position?: string;
  stats?: Record<string, any>;
};

type Props = {
  player: Player;
  onPress?: (p: Player) => void;
};

export default function PlayerCard({ player, onPress }: Props) {
  const router = useRouter();

  function handlePress() {
    if (onPress) return onPress(player);
    const id = player.id ?? player.name;
    // Navigate to player details route using named route + params
    router.push({ pathname: '/player/[id]', params: { id: String(id) } } as any);
  }

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>{player.name?.charAt(0)?.toUpperCase() || '?'}</ThemedText>
        </View>

        <View style={styles.copy}>
          <ThemedText style={styles.name}>{player.name}</ThemedText>
          <ThemedText style={styles.meta}>{player.position || 'N/A'} — {player.team || 'Unknown'}</ThemedText>
        </View>
        <View style={styles.chev}>
          <ThemedText style={{ color: '#9AA3AF', fontSize: 18 }}>›</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5EAF2',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  cardPressed: { opacity: 0.9 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  copy: { gap: 4, flex: 1 },
  chev: { justifyContent: 'center', alignItems: 'center', width: 28 },
  name: { color: '#111827', fontSize: 16, fontWeight: '700' },
  meta: { color: '#5F6B7A', fontSize: 13 },
});
