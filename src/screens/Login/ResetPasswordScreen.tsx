import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../config/supabase';
import { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';

export default function ResetPasswordScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      if (sessionError || !data.user) setError('Sesi reset tidak valid. Silakan minta tautan baru.');
      else setReady(true);
    });
    return () => { mounted = false; };
  }, []);
  const save = async () => {
    if (password.length < 8) { setError('Kata sandi minimal 8 karakter.'); return; }
    if (password !== confirmation) { setError('Konfirmasi kata sandi tidak sama.'); return; }
    setSaving(true);
    setError('');
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await AsyncStorage.removeItem('auth_password_recovery');
      useAuthStore.setState({ isPasswordRecovery: false });
      await useAuthStore.getState().logout();
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kata sandi belum berhasil diubah.');
    } finally { setSaving(false); }
  };
  return <View style={styles.container}>
    <Text style={styles.title}>{done ? 'Kata Sandi Diperbarui' : 'Buat Kata Sandi Baru'}</Text>
    <Text>{done ? 'Silakan masuk memakai kata sandi baru Anda.' : 'Masukkan kata sandi minimal 8 karakter.'}</Text>
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    {ready && !done && <>
      <TextInput style={styles.input} placeholder="Kata sandi baru" secureTextEntry autoCapitalize="none" value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Ulangi kata sandi baru" secureTextEntry autoCapitalize="none" value={confirmation} onChangeText={setConfirmation} />
      <TouchableOpacity style={styles.button} disabled={saving} onPress={save}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Simpan Kata Sandi</Text>}
      </TouchableOpacity>
    </>}
    {(done || !ready) && <TouchableOpacity style={styles.button} onPress={() => navigation.reset({ index: 0, routes: [{ name: done ? 'Login' : 'ForgotPassword' }] })}>
      <Text style={styles.buttonText}>{done ? 'Masuk' : 'Minta Tautan Baru'}</Text>
    </TouchableOpacity>}
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', color: '#024734', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 14, marginTop: 16 },
  error: { color: '#b00020', marginTop: 16 },
  button: { backgroundColor: '#024734', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
