import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { AuthenticatedUser } from '@/services/auth-api';

type SignedInHomeProps = {
  user: AuthenticatedUser;
  onOpenSettings: () => void;
  onSignOut: () => void;
};

export function SignedInHome({
  user,
  onOpenSettings,
  onSignOut,
}: SignedInHomeProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.backgroundAccents}>
        <View style={styles.topBand} />
        <View style={styles.bottomBand} />
      </View>

      <View style={styles.shell}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </ThemedText>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onOpenSettings}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}>
            <SymbolView
              name={{
                ios: 'gearshape.fill',
                android: 'settings',
                web: 'settings',
              }}
              size={18}
              tintColor="#111827"
            />
          </Pressable>
        </View>

        <View style={styles.copy}>
          <ThemedText style={styles.eyebrow}>
            Welcome back
          </ThemedText>

          <ThemedText style={styles.title}>
            Hi, {user.name}
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            Your account is authenticated and connected to the backend.
            Profile management and settings updates are available.
          </ThemedText>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusDot} />
            <ThemedText style={styles.statusTitle}>
              System Status
            </ThemedText>
          </View>

          <View style={styles.statusItem}>
            <ThemedText style={styles.statusLabel}>
              Authentication
            </ThemedText>
            <ThemedText style={styles.statusValue}>
              Active
            </ThemedText>
          </View>

          <View style={styles.statusDivider} />

          <View style={styles.statusItem}>
            <ThemedText style={styles.statusLabel}>
              Backend
            </ThemedText>
            <ThemedText style={styles.statusValue}>
              Connected
            </ThemedText>
          </View>

          <View style={styles.statusDivider} />

          <View style={styles.statusItem}>
            <ThemedText style={styles.statusLabel}>
              Profile API
            </ThemedText>
            <ThemedText style={styles.statusValue}>
              Ready
            </ThemedText>
          </View>
        </View>

        <View style={styles.actionGroup}>
          <Pressable
            accessibilityRole="button"
            onPress={onOpenSettings}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}>
            <ThemedText style={styles.primaryButtonText}>
              Open Settings
            </ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onSignOut}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}>
            <ThemedText style={styles.secondaryButtonText}>
              Sign Out
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  backgroundAccents: {
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
  },

  topBand: {
    position: 'absolute',
    backgroundColor: '#EAF0FF',
    height: '42%',
    left: 0,
    right: 0,
    top: 0,
  },

  bottomBand: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    bottom: 0,
    height: '58%',
    left: 0,
    right: 0,
  },

  shell: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E3E8F0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 24,
    maxWidth: 460,
    padding: 24,
    width: '100%',

    ...Platform.select({
      web: {
        boxShadow: '0px 18px 28px rgba(23, 32, 51, 0.08)',
      },
      default: {
        shadowColor: '#172033',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.08,
        shadowRadius: 28,
      },
    }),
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  avatar: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  iconButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E3E8F0',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  iconButtonPressed: {
    opacity: 0.7,
  },

  copy: {
    gap: 8,
  },

  eyebrow: {
    color: '#4B6BFB',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  title: {
    color: '#111827',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },

  subtitle: {
    color: '#5F6B7A',
    fontSize: 15,
    lineHeight: 23,
  },

  statusCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#D8DEE8',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },

  statusHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  statusDot: {
    backgroundColor: '#22C55E',
    borderRadius: 4,
    height: 8,
    width: 8,
  },

  statusTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },

  statusItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statusDivider: {
    backgroundColor: '#E5EAF2',
    height: 1,
    marginVertical: 12,
  },

  statusLabel: {
    color: '#5F6B7A',
    fontSize: 14,
  },

  statusValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },

  actionGroup: {
    gap: 12,
  },

  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
  },

  primaryButtonPressed: {
    transform: [{ scale: 0.99 }],
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  secondaryButton: {
    alignItems: 'center',
    borderColor: '#D8DEE8',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
  },

  secondaryButtonPressed: {
    opacity: 0.7,
  },

  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});