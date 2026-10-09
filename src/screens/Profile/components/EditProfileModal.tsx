import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Pressable, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../../../assets/styles/Colors';
import { scale, fontScale } from '../../../utils/responsive';
import { useAuthStore } from '../../../store/authStore';
import { supabase } from '../../../config/supabase';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EditProfileModal({ visible, onClose }: EditProfileModalProps) {
  const { user, sendPasswordReset } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
    }
  }, [user]);

  const handleUpdateName = async () => {
    if (!fullName.trim()) {
      Alert.alert('Validasi', 'Nama lengkap tidak boleh kosong');
      return;
    }

    setIsSaving(true);
    try {
      if (user?.id) {
        const newName = fullName.trim();
        const { error } = await supabase
          .from('users')
          .update({ name: newName })
          .eq('id', user.id);

        if (error) {
          throw new Error(error.message);
        }

        try {
          if (user.role === 'client') {
            await supabase
              .from('projects')
              .update({ client_name: newName })
              .eq('client_id', user.id);
          }
        } catch (syncErr) {
          if (__DEV__) { console.warn('[EditProfileModal] Gagal mengupdate nama terikat:', syncErr); }
        }

        const store = useAuthStore.getState();
        if (store.user) {
          useAuthStore.setState({
            user: { ...store.user, full_name: newName },
          });
        }
      }

      Alert.alert('Sukses', 'Nama profil berhasil diperbarui');
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui profil';
      Alert.alert('Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    setIsSaving(true);
    try {
      await sendPasswordReset(user.email);
      Alert.alert('Email Terkirim', `Tautan reset password telah dikirimkan ke email ${user.email}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengirim email reset password';
      Alert.alert('Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Profil Pengguna</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={20} color={colors.grey} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Masukkan nama lengkap"
            placeholderTextColor={colors.grey}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateName} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.resetBtn} onPress={handleResetPassword} disabled={isSaving}>
            <Icon name="key" size={16} color="#0F9F67" style={{ marginRight: 6 }} />
            <Text style={styles.resetBtnText}>Kirim Email Reset Password</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '88%',
    backgroundColor: '#FFF',
    borderRadius: scale(16),
    padding: scale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  title: {
    fontSize: fontScale(16),
    fontWeight: 'bold',
    color: '#002239',
  },
  label: {
    fontSize: fontScale(12.5),
    fontWeight: '600',
    color: '#334155',
    marginBottom: scale(6),
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: scale(10),
    padding: scale(10),
    fontSize: fontScale(13.5),
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSecondary,
    marginBottom: scale(14),
  },
  saveBtn: {
    backgroundColor: '#0F9F67',
    borderRadius: scale(10),
    paddingVertical: scale(12),
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: fontScale(13.5),
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: scale(14),
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: scale(10),
    paddingVertical: scale(10),
  },
  resetBtnText: {
    color: '#0F9F67',
    fontWeight: '700',
    fontSize: fontScale(12.5),
  },
});
