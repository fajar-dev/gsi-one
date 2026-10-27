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

interface AddNoteModalProps {
  visible: boolean;
  stageTitle: string;
  onClose: () => void;
  onSave: (desc: string, progress: string) => Promise<void>;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  visible,
  stageTitle,
  onClose,
  onSave,
}) => {
  const [noteDesc, setNoteDesc] = useState('');
  const [noteProgress, setNoteProgress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setNoteDesc('');
      setNoteProgress('');
      setIsSaving(false);
    }
  }, [visible]);

  const handleSave = async () => {
    if (!noteDesc.trim()) {
      Alert.alert('Error', 'Catatan tidak boleh kosong');
      return;
    }
    setIsSaving(true);
    try {
      await onSave(noteDesc.trim(), noteProgress);
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
              <Text style={styles.modalTitle}>Tambah Catatan</Text>
              <Text style={styles.modalSubtitle}>{stageTitle}</Text>

              <Text style={styles.fieldLabel}>Deskripsi *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Tuliskan catatan kemajuan pekerjaan..."
                placeholderTextColor={colors.grey}
                value={noteDesc}
                onChangeText={setNoteDesc}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                accessibilityLabel="Tuliskan catatan kemajuan pekerjaan..."
              />

              <Text style={styles.fieldLabel}>Persentase Progres (0-100)</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 75"
                placeholderTextColor={colors.grey}
                value={noteProgress}
                onChangeText={setNoteProgress}
                keyboardType="number-pad"
                maxLength={3}
                accessibilityLabel="Contoh: 75"
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
