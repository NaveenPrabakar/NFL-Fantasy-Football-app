import { SymbolView } from 'expo-symbols';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import SearchBar from '@/components/search/SearchBar';
import PlayerCard from '@/components/search/PlayerCard';
import { ThemedText } from '@/components/themed-text';
import { searchPlayers, type PlayerRecord } from '@/services/player-api';
import type { AuthenticatedUser } from '@/services/auth-api';

type SignedInHomeProps = {
  user: AuthenticatedUser;
  onOpenSettings: () => void;
  onSignOut: () => void;
};

export function SignedInHome({ user, onOpenSettings, onSignOut }: SignedInHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<PlayerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (!searchQuery.trim()) {
      setRecords([]);
      setErrorText('');
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchPlayers(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  async function fetchPlayers(query: string) {
    setIsLoading(true);
    setErrorText('');
    try {
      const data = await searchPlayers(query, 1, 20);
      setRecords(data.items);
    } catch (err) {
      setErrorText('Search endpoint communication failure.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.shell}>
        
        <View style={styles.header}>
          <View style={styles.profileBlock}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </ThemedText>
            </View>
            <View>
              <ThemedText style={styles.eyebrow}>DATA INDEX</ThemedText>
              <ThemedText style={styles.title}>{user.name}</ThemedText>
            </View>
          </View>

          <Pressable accessibilityRole="button" onPress={onOpenSettings} style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <SymbolView name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }} size={18} tintColor="#0F172A" />
          </Pressable>
        </View>

        <View style={styles.searchSection}>
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            onSearch={() => fetchPlayers(searchQuery)} 
          />
        </View>

        <View style={styles.resultsContainer}>
          {isLoading && (
            <View style={styles.centeredRow}>
              <ActivityIndicator size="small" color="#0F172A" />
            </View>
          )}

          {!isLoading && errorText.length > 0 && (
            <ThemedText style={styles.errorLabel}>{errorText}</ThemedText>
          )}

          {!isLoading && records.length > 0 && (
            <View style={styles.sectionContainer}>
              {records.map((record, idx) => (
                <PlayerCard key={record.player_id + '-' + record.season + '-' + idx} playerRecord={record} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.footerActions}>
          <Pressable accessibilityRole="button" onPress={onSignOut} style={({ pressed }) => [styles.signOutButton, pressed && styles.signOutPressed]}> 
            <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
          </Pressable>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingVertical: 24, paddingHorizontal: 16, alignItems: 'center' },
  shell: { width: '100%', maxWidth: 480, gap: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileBlock: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  eyebrow: { color: '#64748B', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { color: '#0F172A', fontSize: 20, fontWeight: '800' },
  iconButton: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: 10, borderWidth: 1, height: 38, justifyContent: 'center', width: 38 },
  iconButtonPressed: { opacity: 0.7 },
  searchSection: { width: '100%' },
  resultsContainer: { width: '100%' },
  centeredRow: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
  errorLabel: { textAlign: 'center', color: '#EF4444', fontSize: 13, paddingVertical: 12 },
  sectionContainer: { width: '100%' },
  footerActions: { width: '100%' },
  signOutButton: { alignItems: 'center', borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, justifyContent: 'center', minHeight: 44 },
  signOutPressed: { opacity: 0.8 },
  signOutButtonText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },
});