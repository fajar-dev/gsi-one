import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { ProjectStage } from '../../../services/projectService';
import { colors } from '../../../../assets/styles/Colors';
import { ProjectStageStatusEnum } from '../../../domain/enums/ProjectStatus';
import StatusBadge from './StatusBadge';
import FileAttachment from './FileAttachment';
import Icon from 'react-native-vector-icons/Feather';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface StageTimelineProps {
    stages: ProjectStage[];
    isInternal: boolean;
    onUpdateStatus?: (stageId: string, currentStatus: ProjectStage['status']) => void;
    onAddNote?: (stageId: string, stageTitle: string) => void;
    onUploadFile?: (stageId: string, stageTitle: string) => void;
    onEditStage?: (stage: ProjectStage) => void;
}

function StageTimeline({ stages, isInternal, onUpdateStatus, onAddNote, onUploadFile, onEditStage }: StageTimelineProps): React.ReactElement {
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
                        {}
                        <View style={styles.lineCol}>
                             <View style={[styles.node, { backgroundColor: nodeColor, borderColor: nodeColor }]}>
                                 {stage.status === ProjectStageStatusEnum.DONE && <Icon name="check" size={12} color={colors.white} />}
                                 {stage.status === ProjectStageStatusEnum.IN_PROGRESS && <View style={styles.innerDot} />}
                             </View>
                            {!isLast && <View style={[styles.connector, { backgroundColor: stage.status === ProjectStageStatusEnum.DONE ? colors.accent : colors.border }]} />}
                        </View>

                        {}
                        <View style={styles.stageContent}>
                            <TouchableOpacity
                                style={styles.stageHeader}
                                onPress={() => toggleExpand(stage.id)}
                                activeOpacity={0.7}>
                                <View style={styles.stageTitleRow}>
                                    <Text style={styles.seqText}>{stage.sequence}.</Text>
                                    <Text style={styles.stageTitle} numberOfLines={2}>{stage.title}</Text>
                                </View>
                                <View style={styles.headerRight}>
                                    <StatusBadge status={stage.status} size="sm" />
                                    <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.grey} />
                                </View>
                            </TouchableOpacity>

                            {isExpanded && (
                                <View style={styles.expandedContent}>
                                    {stage.description ? (
                                        <Text style={styles.stageDesc}>{stage.description}</Text>
                                    ) : null}

                                    {}
                                    {isInternal && (
                                        <View style={styles.actionRow}>
                                            <TouchableOpacity
                                                style={styles.actionBtn}
                                                onPress={() => onUpdateStatus?.(stage.id, stage.status)}>
                                                <Text style={styles.actionBtnText}>Ubah Status</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.actionBtn, styles.actionBtnSecondary]}
                                                onPress={() => onAddNote?.(stage.id, stage.title)}>
                                                <Text style={[styles.actionBtnText, styles.actionBtnSecondaryText]}>+ Catatan</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.actionBtn, styles.actionBtnSecondary]}
                                                onPress={() => onUploadFile?.(stage.id, stage.title)}>
                                                <Text style={[styles.actionBtnText, styles.actionBtnSecondaryText]}>+ Berkas</Text>
                                            </TouchableOpacity>
                                            {onEditStage && (
                                                <TouchableOpacity
                                                    style={[styles.actionBtn, styles.actionBtnSecondary]}
                                                    onPress={() => onEditStage(stage)}>
                                                    <Text style={[styles.actionBtnText, styles.actionBtnSecondaryText]}>Edit Tahap</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}

                                    {}
                                    {stage.updates && stage.updates.length > 0 && (
                                        <View style={styles.updatesSection}>
                                            <Text style={styles.sectionLabel}>Catatan & Komentar</Text>
                                            {stage.updates.map(update => {
                                                const isProgressNote = update.progress != null && update.progress > 0;
                                                return (
                                                    <View key={update.id} style={[styles.updateItem, isProgressNote && styles.updateItemProgress]}>
                                                        <View style={styles.updateHeaderRow}>
                                                            <View style={[styles.updateTypeBadge, { backgroundColor: isProgressNote ? colors.primary + '18' : colors.secondary + '18' }]}>
                                                                <Text style={[styles.updateTypeText, { color: isProgressNote ? colors.primary : colors.secondary }]}>
                                                                    {isProgressNote ? 'Catatan Progres' : 'Komentar'}
                                                                </Text>
                                                            </View>
                                                            <Text style={styles.updateDate}>
                                                                {new Date(update.created_at).toLocaleDateString('id-ID', {
                                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                                })}
                                                            </Text>
                                                        </View>
                                                        {isProgressNote && (
                                                            <View style={styles.progressRow}>
                                                                <View style={styles.progressBarBg}>
                                                                    <View style={[styles.progressBarFill, { width: `${update.progress}%` as any }]} />
                                                                </View>
                                                                <Text style={styles.progressText}>{update.progress}%</Text>
                                                            </View>
                                                        )}
                                                        <Text style={styles.updateDesc}>{update.description}</Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    )}


                                    {}
                                    {stage.files && stage.files.length > 0 && (
                                        <View style={styles.filesSection}>
                                            <Text style={styles.sectionLabel}>File Terlampir</Text>
                                            {stage.files.map(file => (
                                                <FileAttachment key={file.id} file={file} />
                                            ))}
                                        </View>
                                    )}

                                    {(stage.updates?.length === 0 && stage.files?.length === 0) && (
                                        <Text style={styles.emptyNote}>Belum ada catatan atau file untuk tahap ini.</Text>
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

const styles = StyleSheet.create({
    container: { paddingVertical: 8 },
    stageRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    lineCol: {
        width: 32,
        alignItems: 'center',
    },
    node: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        zIndex: 1,
    },
    innerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.white,
    },
    connector: {
        width: 2,
        flex: 1,
        minHeight: 20,
        marginVertical: 2,
    },
    stageContent: {
        flex: 1,
        paddingLeft: 10,
        paddingBottom: 16,
    },
    stageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 4,
    },
    stageTitleRow: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 8,
    },
    seqText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textSecondary,
        marginRight: 4,
        minWidth: 18,
    },
    stageTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    expandedContent: {
        marginTop: 8,
        paddingLeft: 4,
    },
    stageDesc: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: 12,
    },
    actionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    actionBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    actionBtnSecondary: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    actionBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.white,
    },
    actionBtnSecondaryText: {
        color: colors.primary,
    },
    updatesSection: { marginBottom: 12 },
    filesSection: { marginBottom: 4 },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    updateItem: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 8,
        padding: 10,
        marginBottom: 6,
    },
    updateItemProgress: {
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
    },
    updateHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    updateTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    updateTypeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    progressBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: colors.border,
        borderRadius: 3,
        marginRight: 8,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    progressText: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.primary,
        minWidth: 32,
    },
    updateDesc: {
        fontSize: 13,
        color: colors.textPrimary,
        lineHeight: 19,
    },
    updateDate: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: 4,
    },
    emptyNote: {
        fontSize: 13,
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
});

export default StageTimeline;
