import { ActionButton } from '../../../../components/ui/ActionButton';
import {
  buttonMetrics,
  touchTarget,
  spacing,
  typography,
  radius,
} from '../../../../theme/tokens';
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { colors } from '../../../../theme/colors';
import type { ProjectStageStatus } from '../../../../domain/models/project';
import Icon from 'react-native-vector-icons/Feather';

interface StatusUpdateModalProps {
  visible: boolean;
  currentStatus: ProjectStageStatus | '';
  onClose: () => void;
  onSave: (status: ProjectStageStatus) => void;
}

const STAGE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Menunggu' },
  { value: 'in_progress', label: 'Sedang Berjalan' },
  { value: 'done', label: 'Selesai' },
] as const;

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  visible,
  currentStatus,
  onClose,
  onSave,
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
        onPress={onClose}
        activeOpacity={1}
        accessible={false}
      >
        <View style={styles.modalSheet}>
          <View style={styles.modalIndicator} />
          <Text style={styles.modalTitle}>Ubah Status Tahapan</Text>
          {STAGE_STATUS_OPTIONS.map(opt => (
            <ActionButton
              key={opt.value}
              style={[
                styles.modalOption,
                currentStatus === opt.value && styles.modalOptionActive,
              ]}
              onPress={() => onSave(opt.value)}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.modalOptionText,
                  currentStatus === opt.value && styles.modalOptionTextActive,
                ]}
              >
                {opt.label}
              </Text>
              {currentStatus === opt.value && (
                <Icon
                  name="check"
                  size={16}
                  color={colors.secondary}
                  style={styles.checkIcon}
                />
              )}
            </ActionButton>
          ))}
          <ActionButton
            style={styles.modalCancelBtn}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={styles.modalCancelText}>Batal</Text>
          </ActionButton>
        </View>
      </ActionButton>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
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
    marginBottom: spacing.lg,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalOptionActive: {
    backgroundColor: colors.backgroundSecondary,
  },
  modalOptionText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  modalOptionTextActive: {
    fontWeight: '700',
    color: colors.secondary,
  },
  checkIcon: {
    marginLeft: spacing.sm,
  },
  modalCancelBtn: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    marginTop: spacing.lg,
    paddingVertical: buttonMetrics.paddingVertical,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.backgroundSecondary,
  },
  modalCancelText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontWeight: '700',
  },
});
