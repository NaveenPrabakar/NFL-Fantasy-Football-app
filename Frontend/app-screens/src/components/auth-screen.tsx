import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { loginUser, registerUser } from '@/services/auth-api';

type AuthMode = 'login' | 'register';

type AuthScreenProps = {
  mode: AuthMode;
};

const modeCopy = {
  login: {
    eyebrow: 'Welcome back',
    title: 'Sign in to Gridiron X',
    subtitle: 'Access your team dashboard, saved reports, and game-day planning tools.',
    submitLabel: 'Sign in',
    successMessage: 'Signed in successfully.',
    helper: 'Use the account connected to your team workspace.',
  },
  register: {
    eyebrow: 'Create account',
    title: 'Start with Gridiron X',
    subtitle: 'Create a secure profile for analysis, roster notes, and weekly preparation.',
    submitLabel: 'Create account',
    successMessage: 'Account created successfully.',
    helper: 'Your workspace can be configured after registration.',
  },
} as const;

export function AuthScreen({ mode }: AuthScreenProps) {
  const copy = modeCopy[mode];
  const isRegister = mode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [hasError, setHasError] = useState(false);

  const canSubmit = useMemo(() => {
    const hasRequiredName = !isRegister || name.trim().length > 0;
    return hasRequiredName && email.trim().length > 0 && password.length > 0 && !isSubmitting;
  }, [email, isRegister, isSubmitting, name, password]);

  async function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');
    setHasError(false);

    try {
      if (isRegister) {
        const message = await registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        setStatusMessage(message || copy.successMessage);
      } else {
        const isAuthenticated = await loginUser({
          email: email.trim(),
          password,
        });
        setHasError(!isAuthenticated);
        setStatusMessage(isAuthenticated ? copy.successMessage : 'Invalid email or password.');
      }
    } catch (error) {
      setHasError(true);
      setStatusMessage(error instanceof Error ? error.message : 'The auth request failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <BackgroundAccents />

            <View style={styles.shell}>
              <View style={styles.panelHeader}>
                <View style={styles.brandMark}>
                  <ThemedText style={styles.brandMarkText}>GX</ThemedText>
                </View>
                <View style={styles.panelCopy}>
                  <ThemedText style={styles.eyebrow}>{copy.eyebrow}</ThemedText>
                  <ThemedText style={styles.title}>{copy.title}</ThemedText>
                  <ThemedText style={styles.subtitle}>{copy.subtitle}</ThemedText>
                </View>
              </View>

              <View style={styles.form}>
                {isRegister && (
                  <AuthField
                    label="Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Full name"
                    iconName={{ ios: 'person.fill', android: 'person', web: 'person' }}
                  />
                )}
                <AuthField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  iconName={{ ios: 'envelope.fill', android: 'mail', web: 'mail' }}
                />
                <AuthField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  secureTextEntry
                  iconName={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
                />
              </View>

              <Pressable
                accessibilityRole="button"
                disabled={!canSubmit}
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.submitButton,
                  !canSubmit && styles.submitButtonDisabled,
                  pressed && styles.submitButtonPressed,
                ]}>
                {isSubmitting ? (
                  <ActivityIndicator color="#0B1117" />
                ) : (
                  <ThemedText style={styles.submitText}>{copy.submitLabel}</ThemedText>
                )}
              </Pressable>

              <View style={styles.helperRow}>
                <SymbolView
                  name={{ ios: 'checkmark.shield.fill', android: 'shield', web: 'shield' }}
                  size={16}
                  tintColor="#4B6BFB"
                />
                <ThemedText style={styles.helperText}>{copy.helper}</ThemedText>
              </View>

              {statusMessage.length > 0 && (
                <View style={[styles.statusBox, hasError && styles.errorBox]}>
                  <ThemedText style={[styles.statusMessage, hasError && styles.errorMessage]}>
                    {statusMessage}
                  </ThemedText>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address';
  secureTextEntry?: boolean;
  iconName: SymbolViewProps['name'];
};

function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  iconName,
  keyboardType = 'default',
  secureTextEntry = false,
}: AuthFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <View style={styles.inputShell}>
        <SymbolView name={iconName} size={18} tintColor="#7E8A9A" />
        <TextInput
          autoCapitalize="none"
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9AA3AF"
          secureTextEntry={secureTextEntry}
          style={styles.input}
          value={value}
        />
      </View>
    </View>
  );
}

function BackgroundAccents() {
  return (
    <View style={styles.backgroundAccents}>
      <View style={styles.topBand} />
      <View style={styles.bottomBand} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 96,
    position: 'relative',
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
    gap: 22,
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
  panelHeader: {
    gap: 18,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
  },
  panelCopy: {
    gap: 8,
  },
  eyebrow: {
    color: '#4B6BFB',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 38,
  },
  subtitle: {
    color: '#5F6B7A',
    fontSize: 15,
    lineHeight: 23,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: '#263241',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#D8DEE8',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  input: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    minHeight: 50,
    padding: 0,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 52,
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonPressed: {
    transform: [{ scale: 0.99 }],
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
  },
  helperRow: {
    alignItems: 'center',
    backgroundColor: '#F3F6FF',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  helperText: {
    color: '#4E5A6B',
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  statusBox: {
    backgroundColor: '#EEF8F2',
    borderColor: '#BDE5C8',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorBox: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFC9D0',
  },
  statusMessage: {
    color: '#137A3A',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#B4232D',
  },
});
