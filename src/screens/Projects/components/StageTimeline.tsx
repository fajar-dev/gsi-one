import { ActionButton } from '../../../components/ui/ActionButton';
import { styles } from './StageTimeline.styles';

import React, { useState } from 'react';
import { View, Text, LayoutAnimation, Platform, UIManager } from 'react-native';
import type { ProjectStage } from '../../../domain/models/project';
import { colors } from '../../../theme/colors';
import { ProjectStageStatusEnum } from '../../../domain/enums/ProjectStatus';
import StatusBadge from './StatusBadge';
import FileAttachment from './FileAttachment';
import Icon from 'react-native-vector-icons/Feather';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface StageTimelineProps {
  stages: ProjectStage[];
  isInternal: boolean;
  onUpdateStatus?: (
    stageId: string,
    currentStatus: ProjectStage['status'],
  ) => void;
  onAddNote?: (stageId: string, stageTitle: string) => void;
  onUploadFile?: (stageId: string, stageTitle: string) => void;
  onEditStage?: (stage: ProjectStage) => void;
}

function StageTimeline({
  stages,
  isInternal,
  onUpdateStatus,
  onAddNote,
  onUploadFile,
  onEditStage,
}: StageTimelineProps): React.ReactElement {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getNodeColor = (status: string) => {
    if (status === ProjectStageStatusEnum.DONE) return colors.accent;
    if (status === ProjectStageStatusEnum.IN_PROGRESS) return colors.primary;
    return colors.border;
  };

  return (
    <View style={styles.container}>
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;
        const isExpanded = expandedIds.has(stage.id);
        const nodeColor = getNodeColor(stage.status);

        return (
          <View key={stage.id} style={styles.stageRow}>
            <View style={styles.lineCol}>
              <View
                style={[
                  styles.node,
                  { backgroundColor: nodeColor, borderColor: nodeColor },
                ]}
              >
                {stage.status === ProjectStageStatusEnum.DONE && (
                  <Icon name="check" size={12} color={colors.white} />
                )}
                {stage.status === ProjectStageStatusEnum.IN_PROGRESS && (
                  <View style={styles.innerDot} />
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor:
                        stage.status === ProjectStageStatusEnum.DONE
                          ? colors.accent
                          : colors.border,
                    },
                  ]}
                />
              )}
            </View>

            <View style={styles.stageContent}>
              <ActionButton
                style={styles.stageHeader}
                onPress={() => toggleExpand(stage.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <View style={styles.stageTitleRow}>
                  <Text style={styles.seqText}>{stage.sequence}.</Text>
                  <Text style={styles.stageTitle} numberOfLines={2}>
                    {stage.title}
                  </Text>
                </View>
                <View style={styles.headerRight}>
                  <StatusBadge status={stage.status} size="sm" />
                  <Icon
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={colors.grey}
                  />
                </View>
              </ActionButton>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  {stage.description ? (
                    <Text style={styles.stageDesc}>{stage.description}</Text>
                  ) : null}

                  {isInternal && (
                    <View style={styles.actionRow}>
                      <ActionButton
                        compact
                        style={styles.actionBtn}
                        onPress={() => onUpdateStatus?.(stage.id, stage.status)}
                        accessibilityRole="button"
                      >
                        <Text style={styles.actionBtnText}>Ubah Status</Text>
                      </ActionButton>
                      <ActionButton
                        compact
                        style={[styles.actionBtn, styles.actionBtnSecondary]}
                        onPress={() => onAddNote?.(stage.id, stage.title)}
                        accessibilityRole="button"
                      >
                        <Text
                          style={[
                            styles.actionBtnText,
                            styles.actionBtnSecondaryText,
                          ]}
                        >
                          + Catatan
                        </Text>
                      </ActionButton>
                      <ActionButton
                        compact
                        style={[styles.actionBtn, styles.actionBtnSecondary]}
                        onPress={() => onUploadFile?.(stage.id, stage.title)}
                        accessibilityRole="button"
                      >
                        <Text
                          style={[
                            styles.actionBtnText,
                            styles.actionBtnSecondaryText,
                          ]}
                        >
                          + Berkas
                        </Text>
                      </ActionButton>
                      {onEditStage && (
                        <ActionButton
                          compact
                          style={[styles.actionBtn, styles.actionBtnSecondary]}
                          onPress={() => onEditStage(stage)}
                          accessibilityRole="button"
                        >
                          <Text
                            style={[
                              styles.actionBtnText,
                              styles.actionBtnSecondaryText,
                            ]}
                          >
                            Edit Tahap
                          </Text>
                        </ActionButton>
                      )}
                    </View>
                  )}

                  {stage.updates && stage.updates.length > 0 && (
                    <View style={styles.updatesSection}>
                      <Text style={styles.sectionLabel}>
                        Catatan & Komentar
                      </Text>
                      {stage.updates.map(update => {
                        const isProgressNote =
                          update.progress != null && update.progress > 0;
                        return (
                          <View
                            key={update.id}
                            style={[
                              styles.updateItem,
                              isProgressNote && styles.updateItemProgress,
                            ]}
                          >
                            <View style={styles.updateHeaderRow}>
                              <View
                                style={[
                                  styles.updateTypeBadge,
                                  {
                                    backgroundColor: isProgressNote
                                      ? colors.primary + '18'
                                      : colors.secondary + '18',
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.updateTypeText,
                                    {
                                      color: isProgressNote
                                        ? colors.primary
                                        : colors.secondary,
                                    },
                                  ]}
                                >
                                  {isProgressNote
                                    ? 'Catatan Progres'
                                    : 'Komentar'}
                                </Text>
                              </View>
                              <Text style={styles.updateDate}>
                                {new Date(update.created_at).toLocaleDateString(
                                  'id-ID',
                                  {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  },
                                )}
                              </Text>
                            </View>
                            {isProgressNote && (
                              <View style={styles.progressRow}>
                                <View style={styles.progressBarBg}>
                                  <View
                                    style={[
                                      styles.progressBarFill,
                                      {
                                        width:
                                          `${update.progress}%` as `${number}%`,
                                      },
                                    ]}
                                  />
                                </View>
                                <Text style={styles.progressText}>
                                  {update.progress}%
                                </Text>
                              </View>
                            )}
                            <Text style={styles.updateDesc}>
                              {update.description}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  {stage.files && stage.files.length > 0 && (
                    <View style={styles.filesSection}>
                      <Text style={styles.sectionLabel}>File Terlampir</Text>
                      {stage.files.map(file => (
                        <FileAttachment key={file.id} file={file} />
                      ))}
                    </View>
                  )}

                  {stage.updates?.length === 0 && stage.files?.length === 0 && (
                    <Text style={styles.emptyNote}>
                      Belum ada catatan atau file untuk tahap ini.
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default StageTimeline;
