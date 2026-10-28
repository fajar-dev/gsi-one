import { ActionButton } from '../../components/ui/ActionButton';
import {
  buttonMetrics,
  palette,
  touchTarget,
  spacing,
  typography,
  radius,
} from '../../theme/tokens';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { authService } from '../../services/authService';
import { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';

export default function ResetPasswordScreen(): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let mounted = true;
    authService
      .hasValidSession()
      .then(valid => {
        if (!mounted) return;
        if (!valid)
          setError('Sesi reset tidak valid. Silakan minta tautan baru.');
        else setReady(true);
      })
      .catch(() => {
        if (mounted)
          setError(
            'Tidak dapat memeriksa sesi. Periksa koneksi lalu buka kembali tautan reset.',
          );
      });
    return () => {
      mounted = false;
    };
  }, []);
  const save = async () => {
    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter.');
      return;
    }
    if (password !== confirmation) {
      setError('Konfirmasi kata sandi tidak sama.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await useAuthStore.getState().completePasswordRecovery(password);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Kata sandi belum berhasil diubah.',
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {done ? 'Kata Sandi Diperbarui' : 'Buat Kata Sandi Baru'}
      </Text>
      <Text>
        {done
          ? 'Silakan masuk memakai kata sandi baru Anda.'
          : 'Masukkan kata sandi minimal 8 karakter.'}
      </Text>
      {!!error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
      {ready && !done && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Kata sandi baru"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Kata sandi baru"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Ulangi kata sandi baru"
            secureTextEntry
            autoCapitalize="none"
            value={confirmation}
            onChangeText={setConfirmation}
            accessibilityLabel="Ulangi kata sandi baru"
            autoCorrect={false}
          />
          <ActionButton
            style={styles.button}
            disabled={saving}
            onPress={save}
            accessibilityRole="button"
          >
            {saving ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <Text style={styles.buttonText}>Simpan Kata Sandi</Text>
            )}
          </ActionButton>
        </>
      )}
      {(done || !ready) && (
        <ActionButton
          style={styles.button}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: done ? 'Login' : 'ForgotPassword' }],
            })
          }
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>
            {done ? 'Masuk' : 'Minta Tautan Baru'}
          </Text>
        </ActionButton>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: palette.white,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: '700',
    color: '#024734',
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: radius.sm,
    padding: 14,
    marginTop: spacing.lg,
  },
  error: { color: '#b00020', marginTop: spacing.lg },
  button: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    backgroundColor: '#024734',
    paddingHorizontal: spacing.lg,
    paddingVertical: buttonMetrics.paddingVertical,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  buttonText: { color: palette.white, fontWeight: '700' },
});
