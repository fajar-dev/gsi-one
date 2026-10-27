import { ActionButton } from '../../../components/ui/ActionButton';
import {
  buttonMetrics,
  palette,
  touchTarget,
  spacing,
  typography,
  radius,
} from '../../../theme/tokens';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { ROLE_LABELS } from '../../../constants/roles';
import { CreateUserRole } from '../../../domain/models/auth';

interface AdminRegisterUserModalProps {
  visible: boolean;
  onClose: () => void;
  newUserName: string;
  setNewUserName: (val: string) => void;
  newUserEmail: string;
  setNewUserEmail: (val: string) => void;
  newUserPassword: string;
  setNewUserPassword: (val: string) => void;
  newUserRole: CreateUserRole;
  setNewUserRole: (val: CreateUserRole) => void;
  isSavingUser: boolean;
  onSubmit: () => void;
}

export const AdminRegisterUserModal: React.FC<AdminRegisterUserModalProps> = ({
  visible,
  onClose,
  newUserName,
  setNewUserName,
  newUserEmail,
  setNewUserEmail,
  newUserPassword,
  setNewUserPassword,
  newUserRole,
  setNewUserRole,
  isSavingUser,
  onSubmit,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ActionButton
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
        accessible={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <Pressable
            style={styles.modalSheet}
            onPress={e => e.stopPropagation()}
            accessible={false}
          >
            <ScrollView
              style={styles.formScroll}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <View style={styles.modalIndicator} />
              <Text style={styles.modalTitle}>Tambah Pengguna Baru</Text>
              <Text style={styles.modalSubtitle}>
                Buat akun pengguna baru untuk klien atau staf internal.
              </Text>

              <Text style={styles.fieldLabel}>Nama Lengkap *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Budi Santoso"
                placeholderTextColor={palette.grey}
                value={newUserName}
                onChangeText={setNewUserName}
                accessibilityLabel="Contoh: Budi Santoso"
              />

              <Text style={styles.fieldLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: budi@perusahaan.com"
                placeholderTextColor={palette.grey}
                value={newUserEmail}
                onChangeText={setNewUserEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Contoh: budi@perusahaan.com"
              />

              <Text style={styles.fieldLabel}>Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Minimal 8 karakter"
                placeholderTextColor={palette.grey}
                value={newUserPassword}
                onChangeText={setNewUserPassword}
                secureTextEntry
                accessibilityLabel="Minimal 8 karakter"
                autoCorrect={false}
              />

              <Text style={styles.fieldLabel}>Peran (Role) *</Text>
              <View style={styles.rolePickerRow}>
                {(['client', 'marketing', 'engineer', 'admin'] as const).map(
                  r => (
                    <ActionButton
                      compact
                      key={r}
                      style={[
                        styles.roleChip,
                        newUserRole === r && styles.roleChipActive,
                      ]}
                      onPress={() => setNewUserRole(r)}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.roleChipText,
                          newUserRole === r && styles.roleChipTextActive,
                        ]}
                      >
                        {ROLE_LABELS[r]}
                      </Text>
                    </ActionButton>
                  ),
                )}
              </View>

              <View style={styles.modalBtnRow}>
                <ActionButton
                  style={styles.modalCancelBtn}
                  onPress={onClose}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalCancelText}>Batal</Text>
                </ActionButton>
                <ActionButton
                  style={[
                    styles.modalSaveBtn,
                    isSavingUser && styles.modalSaveBtnDisabled,
                  ]}
                  onPress={onSubmit}
                  disabled={isSavingUser}
                  accessibilityRole="button"
                >
                  {isSavingUser ? (
                    <ActivityIndicator size="small" color={palette.white} />
                  ) : (
                    <Text style={styles.modalSaveText}>Daftarkan</Text>
                  )}
                </ActionButton>
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </ActionButton>
    </Modal>
  );
};

const styles = StyleSheet.create({
  formScroll: { flexShrink: 1 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'flex-end',
  },
  keyboardAvoid: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
    maxHeight: '92%',
  },
  modalIndicator: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    fontSize: typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSecondary,
  },
  rolePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  roleChip: {
    alignItems: 'center',
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
  },
  roleChipActive: {
    backgroundColor: colors.secondary + '18',
    borderColor: colors.secondary,
  },
  roleChipText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  roleChipTextActive: {
    color: colors.secondary,
    fontWeight: '700',
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  modalCancelBtn: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: buttonMetrics.paddingVertical,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  modalSaveBtn: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: buttonMetrics.paddingVertical,
    alignItems: 'center',
  },
  modalSaveBtnDisabled: {
    backgroundColor: colors.grey,
  },
  modalSaveText: {
    color: palette.white,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
