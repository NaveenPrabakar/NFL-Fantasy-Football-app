import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ActivityIndicator, Pressable } from 'react-native';

import SearchBar from '@/components/search/SearchBar';
import PlayerCard from '@/components/search/PlayerCard';
import { ThemedText } from '@/components/themed-text';
import { searchPlayers } from '@/services/player-api';
import ErrorBanner from '@/components/ui/ErrorBanner';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  async function doSearch() {
    if (!query || query.trim().length === 0) return setResults([]);
    setIsSearching(true);
    setError('');
    try {
      const res = await searchPlayers(query.trim(), 1, 20);
      setResults(res.items);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  async function loadMore() {
    if (isSearching || page >= totalPages) return;
    setIsSearching(true);
    setError('');
    try {
      const res = await searchPlayers(query.trim(), page + 1, 20);
      setResults((r) => [...r, ...res.items]);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load more results');
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <ThemedText style={styles.eyebrow}>Players</ThemedText>
          <ThemedText style={styles.title}>Search NFL players</ThemedText>
          <ThemedText style={styles.subtitle}>Find players by name, position, or team.</ThemedText>
        </View>

        <View style={styles.searchRow}>
          <SearchBar value={query} onChange={setQuery} onSearch={doSearch} />
        </View>

        <View style={styles.resultsSection}>
          <ErrorBanner message={error} />
          {isSearching && results.length === 0 ? (
            <ActivityIndicator style={{ marginTop: 12 }} />
          ) : results.length === 0 ? (
            <ThemedText style={styles.empty}>No players found. Try a different name.</ThemedText>
          ) : (
            results.map((p) => <PlayerCard key={p.id ?? p.name} player={p} />)
          )}

          {page < totalPages && (
            <Pressable onPress={loadMore} style={styles.loadMore} accessibilityRole="button">
              {isSearching ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.loadMoreText}>Load more</ThemedText>}
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FB' },
  content: { paddingHorizontal: 20, paddingVertical: 28, alignItems: 'center' },
  header: { width: '100%', gap: 8, maxWidth: 760, marginBottom: 12 },
  eyebrow: { color: '#4B6BFB', fontSize: 13, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: '#111827', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#5F6B7A', fontSize: 15 },
  searchRow: { width: '100%', maxWidth: 760, marginTop: 8, marginBottom: 12 },
  resultsSection: { width: '100%', maxWidth: 760 },
  empty: { color: '#5F6B7A', padding: 12 },
  loadMore: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loadMoreText: { color: '#fff', fontWeight: '800' },
});
