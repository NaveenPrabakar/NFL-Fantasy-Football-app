import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, onSearch, placeholder = 'Search players, teams, positions...' }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.inputShell}>
        <SymbolView name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }} size={16} tintColor="#64748B" />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={value}
          onChangeText={onChange} // Directly handles typing updates
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChange('')} style={styles.clear} accessibilityLabel="Clear search">
            <ThemedText style={styles.clearIcon}>✕</ThemedText>
          </Pressable>
        )}
      </View>

      <Pressable accessibilityRole="button" onPress={onSearch} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <ThemedText style={styles.buttonText}>Search</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    width: '100%',
  },
  inputShell: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    padding: 0,
  },
  clear: {
    padding: 4,
  },
  clearIcon: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});