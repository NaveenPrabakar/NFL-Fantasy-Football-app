import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { PlayerRecord } from '@/services/player-api';
import { getGraphConfigForPlayer, getGraphImageUrl } from '@/services/graph-api';

type Props = {
  player: PlayerRecord['player'];
};

function GraphCard({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description: string;
  imageUrl: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={styles.graphCard}>
      <View style={styles.graphHeader}>
        <ThemedText style={styles.graphTitle}>{title}</ThemedText>
        <ThemedText style={styles.graphDescription}>{description}</ThemedText>
      </View>

      <View style={styles.graphFrame}>
        {isLoading && !hasError && (
          <View style={styles.loaderWrap}>
            <ActivityIndicator color="#0F172A" />
          </View>
        )}

        {hasError ? (
          <View style={styles.errorWrap}>
            <ThemedText style={styles.errorText}>Graph unavailable right now.</ThemedText>
          </View>
        ) : (
          <Image
            source={{ uri: imageUrl }}
            style={styles.graphImage}
            resizeMode="contain"
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        )}
      </View>
    </View>
  );
}

export default function PlayerGraphAnalysis({ player }: Props) {
  const graphConfig = getGraphConfigForPlayer(player);

  if (!graphConfig) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Career</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>Graphs are only available for offensive skill positions and kickers.</ThemedText>
        </View>
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>Defensive players do not have graphs yet.</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Career</ThemedText>
        <ThemedText style={styles.sectionSubtitle}>{graphConfig.title}</ThemedText>
      </View>

      <View style={styles.graphList}>
        {graphConfig.metrics.map((metric) => {
          const imageUrl = getGraphImageUrl(player, metric.metric);

          if (!imageUrl) {
            return null;
          }

          return (
            <GraphCard
              key={metric.metric}
              title={metric.label}
              description={metric.description}
              imageUrl={imageUrl}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    maxWidth: 480,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
  },
  graphList: {
    gap: 14,
  },
  graphCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  graphHeader: {
    marginBottom: 12,
  },
  graphTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
  graphDescription: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  graphFrame: {
    minHeight: 200,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphImage: {
    width: '100%',
    aspectRatio: 1.8,
  },
  loaderWrap: {
    position: 'absolute',
    zIndex: 1,
  },
  errorWrap: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
  },
});
