import { ActionButton } from '../../../components/ui/ActionButton';
import {
  palette,
  touchTarget,
  spacing,
  radius,
  typography,
} from '../../../theme/tokens';
import React from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import type { ProjectFile } from '../../../domain/models/project';
import { colors } from '../../../theme/colors';
import Icon from 'react-native-vector-icons/Feather';
import { storageService } from '../../../services/storageService';

const FILE_TYPE_ICONS: Record<string, string> = {
  image: 'image',
  report: 'file-text',
  invoice: 'credit-card',
  drawing: 'map',
  contract: 'briefcase',
  video: 'video',
  other: 'file',
};

const FILE_TYPE_COLORS: Record<string, string> = {
  image: '#4CAF50',
  report: '#2196F3',
  invoice: '#FF9800',
  drawing: '#9C27B0',
  contract: palette.error,
  video: '#00BCD4',
  other: '#607D8B',
};

interface FileAttachmentProps {
  file: ProjectFile;
}

function FileAttachment({ file }: FileAttachmentProps): React.ReactElement {
  const iconName = FILE_TYPE_ICONS[file.file_type] ?? FILE_TYPE_ICONS.other;
  const iconColor = FILE_TYPE_COLORS[file.file_type] ?? FILE_TYPE_COLORS.other;

  const handleOpen = async () => {
    try {
      const url = await storageService.openProjectFile(file.file_url);
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error
          ? err.message
          : 'Tidak dapat membuka tautan berkas',
      );
    }
  };

  return (
    <ActionButton
      style={styles.container}
      onPress={handleOpen}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <View style={[styles.iconBox, { backgroundColor: iconColor + '18' }]}>
        <Icon name={iconName} size={20} color={iconColor} />
      </View>
      <View style={styles.info}>
        <Text style={styles.fileName} numberOfLines={1}>
          {file.file_name}
        </Text>
        <Text style={styles.fileType}>{file.file_type.toUpperCase()}</Text>
      </View>
      <Text style={styles.openBtn}>Buka</Text>
    </ActionButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
    marginBottom: spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  fileType: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  openBtn: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: '700',
    paddingLeft: spacing.sm,
  },
});

export default FileAttachment;
