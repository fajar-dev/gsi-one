import { ActionButton } from '../../../components/ui/ActionButton';
import { spacing, radius, typography } from '../../../theme/tokens';
import React from 'react';
import { View, Text, StyleSheet, Modal, FlatList } from 'react-native';
import { colors } from '../../../theme/colors';

interface UserItem {
  id: string;
  name: string;
  email: string;
}

interface UserPickerModalProps {
  visible: boolean;
  title: string;
  data: UserItem[];
  onSelect: (item: UserItem) => void;
  onClose: () => void;
}

const PickerItemDivider = () => <View style={styles.pickerItemDivider} />;

const UserPickerModal: React.FC<UserPickerModalProps> = ({
  visible,
  title,
  data,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <ActionButton
        style={styles.pickerBackdrop}
        activeOpacity={1}
        onPress={onClose}
        accessibilityRole="button"
      >
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerHeaderTitle}>Pilih {title}</Text>
            <ActionButton onPress={onClose} accessibilityRole="button">
              <Text style={styles.pickerCloseBtnText}>Tutup</Text>
            </ActionButton>
          </View>
          <View style={styles.modalDivider} />
          {data.length === 0 ? (
            <Text style={styles.pickerEmptyText}>
              Tidak ada data {title} terdaftar
            </Text>
          ) : (
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ActionButton
                  style={styles.pickerItem}
                  onPress={() => onSelect(item)}
                  accessibilityRole="button"
                >
                  <Text style={styles.pickerItemName}>{item.name}</Text>
                  <Text style={styles.pickerItemEmail}>{item.email}</Text>
                </ActionButton>
              )}
              ItemSeparatorComponent={PickerItemDivider}
              style={styles.pickerList}
            />
          )}
        </View>
      </ActionButton>
    </Modal>
  );
};

const styles = StyleSheet.create({
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    width: '100%',
    maxHeight: '80%',
    padding: spacing.xl,
    elevation: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pickerHeaderTitle: {
    fontSize: typography.bodyLarge,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  pickerCloseBtnText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.secondary,
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: spacing.lg,
  },
  pickerEmptyText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.xl,
  },
  pickerList: {
    marginTop: spacing.xs,
  },
  pickerItem: {
    paddingVertical: spacing.md,
  },
  pickerItemName: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pickerItemEmail: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pickerItemDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});

export default UserPickerModal;
