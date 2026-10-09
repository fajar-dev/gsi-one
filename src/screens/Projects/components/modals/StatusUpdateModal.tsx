import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from 'react-native';
import { colors } from '../../../../../assets/styles/Colors';
import { ProjectStageStatus } from '../../../../services/projectService';
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
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} activeOpacity={1}>
                <View style={styles.modalSheet}>
                    <View style={styles.modalIndicator} />
                    <Text style={styles.modalTitle}>Ubah Status Tahapan</Text>
                    {STAGE_STATUS_OPTIONS.map(opt => (
                        <TouchableOpacity
                            key={opt.value}
                            style={[
                                styles.modalOption,
                                currentStatus === opt.value && styles.modalOptionActive,
                            ]}
                            onPress={() => onSave(opt.value)}>
                            <Text
                                style={[
                                    styles.modalOptionText,
                                    currentStatus === opt.value && styles.modalOptionTextActive,
                                ]}>
                                {opt.label}
                            </Text>
                            {currentStatus === opt.value && <Icon name="check" size={16} color={colors.secondary} style={styles.checkIcon} />}
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
                        <Text style={styles.modalCancelText}>Batal</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
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
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    modalIndicator: {
        width: 36,
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.border,
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 16,
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    modalOptionActive: {
        backgroundColor: colors.backgroundSecondary,
    },
    modalOptionText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    modalOptionTextActive: {
        fontWeight: '700',
        color: colors.secondary,
    },
    checkIcon: {
        marginLeft: 8,
    },
    modalCancelBtn: {
        marginTop: 16,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: colors.backgroundSecondary,
    },
    modalCancelText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '700',
    },
});
