import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Alert,
} from 'react-native';
import { colors } from '../../../../assets/styles/Colors';
import { ProjectStage } from '../../../services/projectService';

interface EditStageModalProps {
    visible: boolean;
    stage: ProjectStage | null;
    onClose: () => void;
    onSave: (title: string, desc: string) => void;
    onDelete?: () => void;
}

export const EditStageModal: React.FC<EditStageModalProps> = ({
    visible,
    stage,
    onClose,
    onSave,
    onDelete,
}) => {
    const handleDelete = () => {
        Alert.alert(
            'Hapus Tahapan',
            'Apakah Anda yakin ingin menghapus tahapan proyek ini? Semua catatan progres dan file terlampir untuk tahap ini akan dihapus.',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => {
                        onDelete?.();
                    }
                }
            ]
        );
    };
    const [stageTitle, setStageTitle] = useState('');
    const [stageDesc, setStageDesc] = useState('');

    useEffect(() => {
        if (visible && stage) {
            setStageTitle(stage.title || '');
            setStageDesc(stage.description || '');
        }
    }, [visible, stage]);

    const handleSave = () => {
        onSave(stageTitle, stageDesc);
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}>
                    <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
                        <View style={styles.modalIndicator} />
                        <Text style={styles.modalTitle}>Edit Tahapan Proyek</Text>
                        <Text style={styles.modalSubtitle}>Ubah judul dan deskripsi tahapan ini.</Text>

                        <Text style={styles.fieldLabel}>Judul Tahapan *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contoh: Pengujian Uji Beban"
                            placeholderTextColor={colors.grey}
                            value={stageTitle}
                            onChangeText={setStageTitle}
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
                        />

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={styles.modalCancelBtnInline} onPress={onClose}>
                                <Text style={styles.modalCancelText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSave}>
                                <Text style={styles.modalSaveText}>Simpan</Text>
                            </TouchableOpacity>
                        </View>

                        {onDelete && (
                            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                                <Text style={styles.deleteBtnText}>Hapus Tahap</Text>
                            </TouchableOpacity>
                        )}
                    </Pressable>
                </KeyboardAvoidingView>
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
    keyboardAvoid: {
        width: '100%',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 48 : 36,
        maxHeight: '92%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: 12,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: colors.textPrimary,
        backgroundColor: colors.backgroundSecondary,
        marginBottom: 10,
    },
    textArea: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: colors.textPrimary,
        backgroundColor: colors.backgroundSecondary,
        marginBottom: 10,
        height: 80,
    },
    modalBtnRow: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 12,
    },
    modalCancelBtnInline: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    modalCancelText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '700',
    },
    modalSaveBtn: {
        flex: 1,
        backgroundColor: colors.secondary,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    modalSaveText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    modalIndicator: {
        width: 36,
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.border,
        alignSelf: 'center',
        marginBottom: 16,
    },
    deleteBtn: {
        backgroundColor: '#D32F2F',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    deleteBtnText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
});

export default EditStageModal;
