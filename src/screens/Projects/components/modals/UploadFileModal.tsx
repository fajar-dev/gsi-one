import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { pick, keepLocalCopy, isErrorWithCode, errorCodes, types } from '@react-native-documents/picker';
import { colors } from '../../../../../assets/styles/Colors';
import { ProjectFileType } from '../../../../services/projectService';
import Icon from 'react-native-vector-icons/Feather';

interface UploadFileModalProps {
    visible: boolean;
    stageTitle: string;
    onClose: () => void;
    onSave: (fileName: string, fileType: ProjectFileType, fileUri?: string) => Promise<void>;
}

interface LocalSelectedFile {
    name: string;
    uri: string;
    type: ProjectFileType;
    size?: number;
}

const FILE_TYPE_OPTIONS: ProjectFileType[] = ['report', 'image'];

export const UploadFileModal: React.FC<UploadFileModalProps> = ({
    visible,
    stageTitle,
    onClose,
    onSave,
}) => {
    const [fileType, setFileType] = useState<ProjectFileType>('report');
    const [localFile, setLocalFile] = useState<LocalSelectedFile | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (visible) {
            setFileType('report');
            setLocalFile(null);
            setIsSaving(false);
        }
    }, [visible]);

    const handlePickImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
                includeBase64: true,
            });

            if (result.errorCode) throw new Error(result.errorMessage || 'Galeri tidak dapat dibuka.');
            if (result.didCancel || !result.assets || result.assets.length === 0) {
                return;
            }

            const asset = result.assets[0];
            if (asset.uri) {
                const name = asset.fileName || `Foto_${Date.now()}.jpg`;
                const uploadUri = asset.base64
                    ? `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`
                    : asset.uri;
                setLocalFile({
                    name,
                    uri: uploadUri,
                    type: 'image',
                    size: asset.fileSize,
                });
                setFileType('image');
            }
        } catch (err) {
            if (__DEV__) { console.warn('Image picker error:', err); }
            Alert.alert('Error', 'Gagal memilih foto dari galeri');
        }
    };

    const handlePickDocument = async () => {
        try {
            const [res] = await pick({
                type: [types.allFiles],
            });

            if (res && res.uri) {
                const name = res.name || `Dokumen_${Date.now()}.pdf`;
                const [localCopy] = await keepLocalCopy({
                    files: [{
                        uri: res.uri,
                        fileName: name,
                        ...(res.isVirtual && res.convertibleToMimeTypes?.[0]
                            ? { convertVirtualFileToType: res.convertibleToMimeTypes[0].mimeType }
                            : {}),
                    }],
                    destination: 'cachesDirectory',
                });

                if (!localCopy || localCopy.status !== 'success') {
                    throw new Error(localCopy?.status === 'error' ? localCopy.copyError : 'Tidak dapat menyalin berkas ke penyimpanan aplikasi');
                }

                const ext = name.split('.').pop()?.toLowerCase();
                const isImg = ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp';
                const detectedType: ProjectFileType = isImg ? 'image' : 'report';

                setLocalFile({
                    name,
                    uri: localCopy.localUri,
                    type: detectedType,
                    size: res.size || undefined,
                });
                setFileType(detectedType);
            }
        } catch (err) {
            if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
                return;
            }
            if (__DEV__) { console.warn('Document picker error:', err); }
            Alert.alert('Error', 'Gagal memilih berkas dari HP');
        }
    };

    const handleSave = async () => {
        if (!localFile) {
            Alert.alert('Pilih Berkas', 'Silakan pilih foto dari galeri atau dokumen dari HP Anda terlebih dahulu.');
            return;
        }
        if (localFile.size === 0) { Alert.alert('Berkas Kosong', 'Pilih berkas yang berisi data.'); return; }
        setIsSaving(true);
        try {
            await onSave(localFile.name, fileType, localFile.uri);
        } catch {
        } finally {
            setIsSaving(false);
        }
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '';
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}>
                    <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
                        <View style={styles.modalIndicator} />
                        <Text style={styles.modalTitle}>Unggah Berkas/Foto Asli</Text>
                        <Text style={styles.modalSubtitle}>{stageTitle}</Text>

                        <Text style={styles.fieldLabel}>Pilih File dari HP</Text>
                        <View style={styles.pickerBtnRow}>
                            <TouchableOpacity style={styles.pickBtnPrimary} onPress={handlePickImage} activeOpacity={0.8}>
                                <Icon name="image" size={18} color={colors.white} />
                                <Text style={styles.pickBtnTextPrimary}>Foto / Galeri</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.pickBtnSecondary} onPress={handlePickDocument} activeOpacity={0.8}>
                                <Icon name="file-text" size={18} color={colors.secondary} />
                                <Text style={styles.pickBtnTextSecondary}>Dokumen HP</Text>
                            </TouchableOpacity>
                        </View>

                        {localFile ? (
                            <View style={styles.selectedCard}>
                                <View style={styles.selectedHeader}>
                                    <Icon name={localFile.type === 'image' ? 'image' : 'file-text'} size={22} color={colors.secondary} />
                                    <View style={styles.selectedTextWrapper}>
                                        <Text style={styles.selectedFileName} numberOfLines={1}>{localFile.name}</Text>
                                        <Text style={styles.selectedMetaText}>
                                            File Terpilih dari HP {formatFileSize(localFile.size) ? `• ${formatFileSize(localFile.size)}` : ''}
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setLocalFile(null)}>
                                        <Icon name="x-circle" size={20} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.emptyDropzone}>
                                <Icon name="upload-cloud" size={32} color={colors.textSecondary} />
                                <Text style={styles.emptyText}>Belum ada file terpilih</Text>
                                <Text style={styles.emptySubtext}>Klik tombol di atas untuk memilih foto galeri atau dokumen HP</Text>
                            </View>
                        )}

                        <Text style={styles.fieldLabel}>Kategori Berkas</Text>
                        <View style={styles.fileTypeContainer}>
                            {FILE_TYPE_OPTIONS.map(type => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.typeBadge, fileType === type && styles.typeBadgeActive]}
                                    onPress={() => setFileType(type)}>
                                    <Text style={[styles.typeBadgeText, fileType === type && styles.typeBadgeTextActive]}>
                                        {type === 'report' ? 'LAPORAN (PDF/DOC)' : 'FOTO / GAMBAR'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={styles.modalCancelBtnInline} onPress={onClose}>
                                <Text style={styles.modalCancelText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalSaveBtn, (!localFile || isSaving) && styles.modalSaveBtnDisabled]}
                                onPress={handleSave}
                                disabled={!localFile || isSaving}>
                                {isSaving ? (
                                    <ActivityIndicator size="small" color={colors.white} />
                                ) : (
                                    <Text style={styles.modalSaveText}>Unggah Berkas</Text>
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
        marginBottom: 12,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: 12,
        marginBottom: 8,
    },
    pickerBtnRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    pickBtnPrimary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.secondary,
        borderRadius: 10,
        paddingVertical: 14,
    },
    pickBtnTextPrimary: {
        color: colors.white,
        fontSize: 13,
        fontWeight: '700',
    },
    pickBtnSecondary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1.5,
        borderColor: colors.secondary,
        borderRadius: 10,
        paddingVertical: 14,
        backgroundColor: colors.secondary + '0E',
    },
    pickBtnTextSecondary: {
        color: colors.secondary,
        fontSize: 13,
        fontWeight: '700',
    },
    selectedCard: {
        backgroundColor: colors.secondary + '12',
        borderWidth: 1.5,
        borderColor: colors.secondary,
        borderRadius: 12,
        padding: 14,
        marginVertical: 6,
    },
    selectedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    selectedTextWrapper: {
        flex: 1,
    },
    selectedFileName: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    selectedMetaText: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 2,
    },
    emptyDropzone: {
        borderWidth: 1.5,
        borderColor: colors.border,
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgroundSecondary,
        marginVertical: 6,
    },
    emptyText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: 6,
    },
    emptySubtext: {
        fontSize: 11,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 2,
    },
    fileTypeContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    typeBadge: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
    },
    typeBadgeActive: {
        borderColor: colors.secondary,
        backgroundColor: colors.secondary + '12',
    },
    typeBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    typeBadgeTextActive: {
        color: colors.secondary,
        fontWeight: '700',
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
