import { ActionButton } from '../../../../components/ui/ActionButton';
import { styles } from './UploadFileModal.styles';
import { releaseObjectUrl } from '../../../../utils/fileUri';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  pick,
  keepLocalCopy,
  isErrorWithCode,
  errorCodes,
  types,
} from '@react-native-documents/picker';
import { colors } from '../../../../theme/colors';
import type { ProjectFileType } from '../../../../domain/models/project';
import Icon from 'react-native-vector-icons/Feather';

interface UploadFileModalProps {
  visible: boolean;
  stageTitle: string;
  onClose: () => void;
  onSave: (
    fileName: string,
    fileType: ProjectFileType,
    fileUri?: string,
  ) => Promise<void>;
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

  useEffect(() => () => releaseObjectUrl(localFile?.uri), [localFile]);
  useEffect(() => {
    if (!visible) setLocalFile(null);
  }, [visible]);

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
      });

      if (result.errorCode)
        throw new Error(result.errorMessage || 'Galeri tidak dapat dibuka.');
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
      if (__DEV__) {
        console.warn('Image picker error:', err);
      }
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
          files: [
            {
              uri: res.uri,
              fileName: name,
              ...(res.isVirtual && res.convertibleToMimeTypes?.[0]
                ? {
                    convertVirtualFileToType:
                      res.convertibleToMimeTypes[0].mimeType,
                  }
                : {}),
            },
          ],
          destination: 'cachesDirectory',
        });

        if (!localCopy || localCopy.status !== 'success') {
          throw new Error(
            localCopy?.status === 'error'
              ? localCopy.copyError
              : 'Tidak dapat menyalin berkas ke penyimpanan aplikasi',
          );
        }

        const ext = name.split('.').pop()?.toLowerCase();
        const isImg =
          ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp';
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
      if (__DEV__) {
        console.warn('Document picker error:', err);
      }
      Alert.alert('Error', 'Gagal memilih berkas dari HP');
    }
  };

  const handleSave = async () => {
    if (!localFile) {
      Alert.alert(
        'Pilih Berkas',
        'Silakan pilih foto dari galeri atau dokumen dari HP Anda terlebih dahulu.',
      );
      return;
    }
    if (localFile.size === 0) {
      Alert.alert('Berkas Kosong', 'Pilih berkas yang berisi data.');
      return;
    }
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
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Unggah Berkas/Foto Asli</Text>
            <Text style={styles.modalSubtitle}>{stageTitle}</Text>

            <Text style={styles.fieldLabel}>Pilih File dari HP</Text>
            <View style={styles.pickerBtnRow}>
              <ActionButton
                style={styles.pickBtnPrimary}
                onPress={handlePickImage}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Icon name="image" size={18} color={colors.white} />
                <Text style={styles.pickBtnTextPrimary}>Foto / Galeri</Text>
              </ActionButton>

              <ActionButton
                style={styles.pickBtnSecondary}
                onPress={handlePickDocument}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Icon name="file-text" size={18} color={colors.secondary} />
                <Text style={styles.pickBtnTextSecondary}>Dokumen HP</Text>
              </ActionButton>
            </View>

            {localFile ? (
              <View style={styles.selectedCard}>
                <View style={styles.selectedHeader}>
                  <Icon
                    name={localFile.type === 'image' ? 'image' : 'file-text'}
                    size={22}
                    color={colors.secondary}
                  />
                  <View style={styles.selectedTextWrapper}>
                    <Text style={styles.selectedFileName} numberOfLines={1}>
                      {localFile.name}
                    </Text>
                    <Text style={styles.selectedMetaText}>
                      File Terpilih dari HP{' '}
                      {formatFileSize(localFile.size)
                        ? `• ${formatFileSize(localFile.size)}`
                        : ''}
                    </Text>
                  </View>
                  <ActionButton
                    onPress={() => setLocalFile(null)}
                    accessibilityRole="button"
                  >
                    <Icon
                      name="x-circle"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </ActionButton>
                </View>
              </View>
            ) : (
              <View style={styles.emptyDropzone}>
                <Icon
                  name="upload-cloud"
                  size={32}
                  color={colors.textSecondary}
                />
                <Text style={styles.emptyText}>Belum ada file terpilih</Text>
                <Text style={styles.emptySubtext}>
                  Klik tombol di atas untuk memilih foto galeri atau dokumen HP
                </Text>
              </View>
            )}

            <Text style={styles.fieldLabel}>Kategori Berkas</Text>
            <View style={styles.fileTypeContainer}>
              {FILE_TYPE_OPTIONS.map(type => (
                <ActionButton
                  compact
                  key={type}
                  style={[
                    styles.typeBadge,
                    fileType === type && styles.typeBadgeActive,
                  ]}
                  onPress={() => setFileType(type)}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.typeBadgeText,
                      fileType === type && styles.typeBadgeTextActive,
                    ]}
                  >
                    {type === 'report' ? 'LAPORAN (PDF/DOC)' : 'FOTO / GAMBAR'}
                  </Text>
                </ActionButton>
              ))}
            </View>

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
                  (!localFile || isSaving) && styles.modalSaveBtnDisabled,
                ]}
                onPress={handleSave}
                disabled={!localFile || isSaving}
                accessibilityRole="button"
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.modalSaveText}>Unggah Berkas</Text>
                )}
              </ActionButton>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </ActionButton>
    </Modal>
  );
};
