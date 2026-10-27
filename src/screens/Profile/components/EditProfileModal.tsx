import { ActionButton } from '../../../components/ui/ActionButton';
import {
  buttonMetrics,
  palette,
  touchTarget,
  radius,
  spacing,
  typography,
} from '../../../theme/tokens';
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../../theme/colors';
import { scale, fontScale } from '../../../utils/responsive';
import { useAuthStore } from '../../../store/authStore';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EditProfileModal({ visible, onClose }: EditProfileModalProps) {
  const { user, sendPasswordReset, updateProfileName } = useAuthStore();
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
      await updateProfileName(fullName);

      Alert.alert('Sukses', 'Nama profil berhasil diperbarui');
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Gagal memperbarui profil';
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
      Alert.alert(
        'Email Terkirim',
        `Tautan reset password telah dikirimkan ke email ${user.email}`,
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal mengirim email reset password';
      Alert.alert('Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} accessible={false}>
        <Pressable
          style={styles.content}
          onPress={event => event.stopPropagation()}
          accessible={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Edit Profil Pengguna</Text>
            <ActionButton
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Tutup"
            >
              <Icon name="x" size={20} color={colors.grey} />
            </ActionButton>
          </View>

          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Masukkan nama lengkap"
            placeholderTextColor={colors.grey}
            accessibilityLabel="Masukkan nama lengkap"
          />

          <ActionButton
            style={styles.saveBtn}
            onPress={handleUpdateName}
            disabled={isSaving}
            accessibilityRole="button"
          >
            {isSaving ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
            )}
          </ActionButton>

          <View style={styles.divider} />

          <ActionButton
            style={styles.resetBtn}
            onPress={handleResetPassword}
            disabled={isSaving}
            accessibilityRole="button"
          >
            <Icon
              name="key"
              size={16}
              color={palette.brand}
              style={styles.staticStyle1}
            />
            <Text style={styles.resetBtnText}>Kirim Email Reset Password</Text>
          </ActionButton>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  staticStyle1: { marginRight: 6 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '88%',
    backgroundColor: palette.white,
    borderRadius: scale(radius.lg),
    padding: scale(spacing.xl),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(spacing.lg),
  },
  title: {
    fontSize: fontScale(typography.bodyLarge),
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
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    backgroundColor: palette.brand,
    borderRadius: scale(10),
    paddingVertical: buttonMetrics.paddingVertical,
    alignItems: 'center',
  },
  saveBtnText: {
    color: palette.white,
    fontWeight: 'bold',
    fontSize: fontScale(13.5),
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: scale(14),
  },
  resetBtn: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: scale(10),
    paddingVertical: scale(10),
  },
  resetBtnText: {
    color: palette.brand,
    fontWeight: '700',
    fontSize: fontScale(12.5),
  },
});
