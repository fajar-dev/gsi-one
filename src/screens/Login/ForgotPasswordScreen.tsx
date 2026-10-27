import { ActionButton } from '../../components/ui/ActionButton';
import {
  buttonMetrics,
  touchTarget,
  spacing,
  typography,
  radius,
} from '../../theme/tokens';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';
import Icon from 'react-native-vector-icons/Feather';
import { scale } from '../../utils/responsive';

function ForgotPasswordScreen(): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { sendPasswordReset, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSendReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Masukkan alamat email Anda');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Format email tidak valid');
      return;
    }
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Tidak dapat mengirim email reset password';
      Alert.alert('Gagal', message);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>&#10004;</Text>
          <Text style={styles.successTitle}>Email Terkirim</Text>
          <Text style={styles.successMessage}>
            Kami telah mengirimkan tautan reset password ke:
          </Text>
          <Text style={styles.emailHighlight}>{email}</Text>
          <Text style={styles.successNote}>
            Periksa kotak masuk atau folder spam Anda. Gunakan tautan terbaru
            sebelum kedaluwarsa.
          </Text>
          <ActionButton
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Kembali ke Login</Text>
          </ActionButton>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <ActionButton
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Icon
              name="arrow-left"
              size={scale(20)}
              color={colors.textPrimary}
            />
          </ActionButton>

          <Text style={styles.title}>Lupa Password</Text>
          <Text style={styles.subtitle}>
            Masukkan email akun GSI Anda. Kami akan mengirimkan tautan untuk
            membuat password baru.
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email terdaftar"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
            accessibilityLabel="Masukkan email terdaftar"
          />

          <ActionButton
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSendReset}
            disabled={isLoading}
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Kirim Tautan Reset</Text>
            )}
          </ActionButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    padding: spacing.xxl,
    justifyContent: 'center',
  },
  backButton: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    position: 'absolute',
    top: 56,
    left: 24,
    width: touchTarget.minSize,
    height: touchTarget.minSize,
    borderRadius: scale(18),
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.section,
    textAlign: 'center',
    lineHeight: 22,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSecondary,
    marginBottom: spacing.xxl,
  },
  button: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    backgroundColor: colors.secondary,
    borderRadius: radius.md,
    paddingVertical: buttonMetrics.paddingVertical,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: { backgroundColor: colors.grey },
  buttonText: {
    color: colors.white,
    fontSize: typography.bodyLarge,
    fontWeight: 'bold',
  },
  successBox: {
    padding: spacing.section,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 56,
    color: colors.secondary,
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: typography.heading,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  successMessage: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emailHighlight: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: spacing.lg,
  },
  successNote: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.section,
  },
});

export default ForgotPasswordScreen;
