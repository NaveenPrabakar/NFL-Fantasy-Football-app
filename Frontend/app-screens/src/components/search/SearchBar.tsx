import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, onSearch, placeholder = 'Search players' }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.inputShell}>
        <SymbolView name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }} size={18} tintColor="#7E8A9A" />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9AA3AF"
          style={styles.input}
          value={value}
          onChangeText={onChange}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChange('')} style={styles.clear} accessibilityLabel="Clear search">
            <ThemedText style={{ color: '#9AA3AF', fontSize: 14 }}>✕</ThemedText>
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
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  inputShell: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#D8DEE8',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
  },
  clear: {
    padding: 6,
  },
  button: {
    backgroundColor: '#111827',
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  buttonPressed: { opacity: 0.9 },
  buttonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});
