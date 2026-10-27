import { ActionButton } from '../../../../components/ui/ActionButton';
import {
  buttonMetrics,
  touchTarget,
  spacing,
  typography,
} from '../../../../theme/tokens';
import React, { useState, useEffect } from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../../theme/colors';

interface CreateStageModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, desc: string) => Promise<void>;
}

export const CreateStageModal: React.FC<CreateStageModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [stageTitle, setStageTitle] = useState('');
  const [stageDesc, setStageDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setStageTitle('');
      setStageDesc('');
      setIsSaving(false);
    }
  }, [visible]);

  const handleSave = async () => {
    if (!stageTitle.trim()) {
      Alert.alert('Error', 'Judul tahapan wajib diisi');
      return;
    }
    setIsSaving(true);
    try {
      await onSave(stageTitle.trim(), stageDesc.trim());
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

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
              <Text style={styles.modalTitle}>Tambah Tahapan Proyek</Text>
              <Text style={styles.modalSubtitle}>
                Tahapan baru akan ditambahkan di akhir urutan linimasa.
              </Text>

              <Text style={styles.fieldLabel}>Judul Tahapan *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Pengujian Uji Beban"
                placeholderTextColor={colors.grey}
                value={stageTitle}
                onChangeText={setStageTitle}
                accessibilityLabel="Contoh: Pengujian Uji Beban"
              />

              <Text style={styles.fieldLabel}>Deskripsi Tahapan</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Tulis deskripsi detail tugas pada tahapan ini..."
                placeholderTextColor={colors.grey}
                value={stageDesc}
                onChangeText={setStageDesc}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                accessibilityLabel="Tulis deskripsi detail tugas pada tahapan ini..."
              />

              <View style={styles.modalBtnRow}>
                <ActionButton
                  style={styles.modalCancelBtnInline}
                  onPress={onClose}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalCancelText}>Batal</Text>
                </ActionButton>
                <ActionButton
                  style={[
                    styles.modalSaveBtn,
                    isSaving && styles.modalSaveBtnDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={isSaving}
                  accessibilityRole="button"
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.modalSaveText}>Simpan</Text>
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
    backgroundColor: colors.white,
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
    marginTop: spacing.md,
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
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    fontSize: typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSecondary,
    marginBottom: 10,
    height: 80,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  modalCancelBtnInline: {
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
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
