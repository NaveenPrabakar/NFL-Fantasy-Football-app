import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { updateUserProfile, type AuthenticatedUser } from '@/services/auth-api';

type SettingsPanelProps = {
  user: AuthenticatedUser;
  onBack: () => void;
  onUpdateUser: (user: AuthenticatedUser) => void;
};

export function SettingsPanel({
  user,
  onBack,
  onUpdateUser,
}: SettingsPanelProps) {
  const [name, setName] = useState(user.name || '');
  const [email] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const canSave = useMemo(
    () =>
      (name?.trim?.() ?? '').length > 0 &&
      (!password || password.length >= 6) &&
      !isSubmitting,
    [name, password, isSubmitting]
  );

  async function handleSave() {
    if (!canSave) return;

    setIsSubmitting(true);
    setStatusMessage('');
    setHasError(false);

    try {
      const whatChanged = password.length > 0 ? 'password' : 'name';

      await updateUserProfile({
        name: name.trim(),
        email,
        password: password || 'unchanged',
        whatChanged,
      });

      onUpdateUser({
        ...user,
        name: name.trim(),
      });

      setPassword('');
      setStatusMessage('Profile updated successfully.');
    } catch (error) {
      setHasError(true);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update profile.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.backgroundAccents}>
          <View style={styles.topBand} />
          <View style={styles.bottomBand} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.shell}>
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <SymbolView
                  name={{
                    ios: 'gearshape.fill',
                    android: 'settings',
                    web: 'settings',
                  }}
                  size={20}
                  tintColor="#FFFFFF"
                />
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={onBack}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.backButtonPressed,
                ]}>
                <ThemedText style={styles.backButtonText}>
                  Back
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.copy}>
              <ThemedText style={styles.eyebrow}>
                Settings
              </ThemedText>

              <ThemedText style={styles.title}>
                Update your profile
              </ThemedText>

              <ThemedText style={styles.subtitle}>
                Manage your account information and keep your profile
                synchronized with the backend.
              </ThemedText>
            </View>

            <View style={styles.form}>
              <Field
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                icon={{
                  ios: 'person.fill',
                  android: 'person',
                  web: 'person',
                }}
              />

              <Field
                label="Email"
                value={email}
                editable={false}
                placeholder=""
                icon={{
                  ios: 'envelope.fill',
                  android: 'mail',
                  web: 'mail',
                }}
              />

              <Field
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter new password"
                icon={{
                  ios: 'lock.fill',
                  android: 'lock',
                  web: 'lock',
                }}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={!canSave}
              onPress={handleSave}
              style={({ pressed }) => [
                styles.primaryButton,
                !canSave && styles.primaryButtonDisabled,
                pressed && styles.primaryButtonPressed,
              ]}>
              <ThemedText style={styles.primaryButtonText}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </ThemedText>
            </Pressable>

            {statusMessage.length > 0 && (
              <View
                style={[
                  styles.statusBox,
                  hasError && styles.errorBox,
                ]}>
                <ThemedText
                  style={[
                    styles.statusText,
                    hasError && styles.errorText,
                  ]}>
                  {statusMessage}
                </ThemedText>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  placeholder: string;
  icon: any;
  editable?: boolean;
  secureTextEntry?: boolean;
  onChangeText?: (value: string) => void;
};

function Field({
  label,
  value,
  placeholder,
  icon,
  editable = true,
  secureTextEntry = false,
  onChangeText,
}: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <ThemedText style={styles.fieldLabel}>
        {label}
      </ThemedText>

      <View style={styles.inputShell}>
        <SymbolView
          name={icon}
          size={18}
          tintColor="#7E8A9A"
        />

        <TextInput
          value={value}
          editable={editable}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9AA3AF"
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          style={[
            styles.input,
            !editable && styles.disabledInput,
          ]}
        />
      </View>
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

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 96,
  },

  backgroundAccents: {
    position: 'absolute',
    inset: 0,
  },

  topBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: '#EAF0FF',
  },

  bottomBand: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '58%',
    backgroundColor: '#FFFFFF',
  },

  shell: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3E8F0',
    padding: 24,
    gap: 22,

    ...Platform.select({
      web: {
        boxShadow: '0px 18px 28px rgba(23,32,51,0.08)',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3E8F0',
    justifyContent: 'center',
  },

  backButtonPressed: {
    opacity: 0.7,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
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
  },

  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#D8DEE8',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },

  input: {
    flex: 1,
    minHeight: 50,
    fontSize: 16,
    color: '#111827',
    padding: 0,
  },

  disabledInput: {
    color: '#6B7280',
  },

  primaryButton: {
    minHeight: 52,
    borderRadius: 8,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryButtonPressed: {
    transform: [{ scale: 0.99 }],
  },

  primaryButtonDisabled: {
    opacity: 0.45,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  statusBox: {
    backgroundColor: '#EEF8F2',
    borderColor: '#BDE5C8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  errorBox: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFC9D0',
  },

  statusText: {
    color: '#137A3A',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  errorText: {
    color: '#B4232D',
  },
});