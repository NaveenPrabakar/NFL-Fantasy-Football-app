import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

type Props = { message: string };

export default function ErrorBanner({ message }: Props) {
  if (!message) return null;
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFC9D0',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  text: {
    color: '#B4232D',
    fontWeight: '700',
  },
});
