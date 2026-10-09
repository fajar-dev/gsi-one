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
    ActivityIndicator,
} from 'react-native';
import { colors } from '../../../../../assets/styles/Colors';

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
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}>
                    <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
                        <View style={styles.modalIndicator} />
                        <Text style={styles.modalTitle}>Tambah Tahapan Proyek</Text>
                        <Text style={styles.modalSubtitle}>Tahapan baru akan ditambahkan di akhir urutan linimasa.</Text>

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
                            <TouchableOpacity
                                style={[styles.modalSaveBtn, isSaving && styles.modalSaveBtnDisabled]}
                                onPress={handleSave}
                                disabled={isSaving}>
                                {isSaving ? (
                                    <ActivityIndicator size="small" color={colors.white} />
                                ) : (
                                    <Text style={styles.modalSaveText}>Simpan</Text>
                                )}
                            </TouchableOpacity>
                        </View>
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
        paddingBottom: Platform.OS === 'ios' ? 44 : 24,
        maxHeight: '92%',
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
    modalSaveBtnDisabled: {
        backgroundColor: colors.grey,
    },
    modalSaveText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
});
