import React, { JSX } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    ActivityIndicator, Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../../assets/styles/Colors';
import { scale, fontScale } from '../../utils/responsive';
import StatusBadge from './components/StatusBadge';
import FileAttachment from './components/FileAttachment';
import StageTimeline from './components/StageTimeline';
import { useProjectDetail } from '../../hooks/useProjectDetail';
import { canManageStagesRole } from '../../domain/enums/UserRole';
import {
    StatusUpdateModal,
    AddNoteModal,
    UploadFileModal,
    CreateStageModal,
} from './components/ProjectSubModals';
import EditProjectModal from './components/EditProjectModal';
import { EditStageModal } from './components/EditStageModal';

type RouteProps = RouteProp<RootStackParamList, 'ProjectDetail'>;

function ProjectDetailScreen(): JSX.Element {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProps>();
    const insets = useSafeAreaInsets();
    const { projectId, projectName } = route.params;

    const {
        user,
        project,
        isLoadingDetail,
        error,
        isMarketing,
        isClient,
        isInternal,
        canEditProject,
        statusModal,
        setStatusModal,
        noteModal,
        setNoteModal,
        fileModal,
        setFileModal,
        createStageModal,
        setCreateStageModal,
        editProjectModal,
        setEditProjectModal,
        editStageModal,
        setEditStageModal,
        isSaving,
        realtimeToast,
        toastOpacity,
        handleUpdateStatus,
        handleAddNote,
        handleAddFile,
        handleCreateStage,
        handleUpdateStageDetails,
        handleDeleteStage,
        formatDate,
        formatCurrency,
        refetch,
    } = useProjectDetail(projectId);

    const headerGradientColors: [string, string] = ['#002239', '#0F9F67'];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={headerGradientColors}
                style={[
                    styles.headerGradient,
                    { paddingTop: insets.top > 0 ? insets.top + scale(8) : scale(16) }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerTopRow}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backBtn}
                        activeOpacity={0.7}
                    >
                        <Icon name="arrow-left" size={scale(20)} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{projectName}</Text>
                    {canEditProject ? (
                        <TouchableOpacity onPress={() => setEditProjectModal(true)} style={styles.headerEditBtn} activeOpacity={0.8}>
                            <Icon name="edit-2" size={12} color="#FFF" style={styles.headerEditIcon} />
                            <Text style={styles.headerEditText}>Edit</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.headerSpacer} />
                    )}
                </View>
                <Text style={styles.headerSubtitle}>
                    {project?.project_code ? `Kode: ${project.project_code} • Detail & Tahapan Proyek` : 'Detail Informasi & Tahapan Proyek'}
                </Text>
            </LinearGradient>

            {isLoadingDetail ? (
                <ActivityIndicator color="#0F9F67" style={styles.loader} />
            ) : !project || String(project.id) !== String(projectId) ? (
                <View style={styles.errorState}>
                    <Icon name="alert-circle" size={40} color="#BDBDBD" />
                    <Text style={styles.errorText}>
                        {error || 'Proyek tidak ditemukan.'}
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {}
                    <View style={[styles.infoCard, isMarketing && styles.infoCardMarketingBorder]}>
                        <View style={styles.infoCardHeader}>
                            <View style={styles.infoCardTitleCol}>
                                {!isClient && <Text style={styles.projectCode}>{project.project_code}</Text>}
                                <Text style={styles.projectName}>{project.project_name}</Text>
                            </View>
                            <StatusBadge status={project.status} />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <View style={styles.infoLabelRow}>
                                    <Icon name="user" size={12} color="#757575" style={styles.infoIcon} />
                                    <Text style={styles.infoLabel}>Klien</Text>
                                </View>
                                <Text style={styles.infoValue}>{project.client_name ?? '-'}</Text>
                            </View>

                            {!isClient && (
                                <View style={styles.infoItem}>
                                    <View style={styles.infoLabelRow}>
                                        <Icon name="credit-card" size={12} color="#757575" style={styles.infoIcon} />
                                        <Text style={styles.infoLabel}>Anggaran</Text>
                                    </View>
                                    <Text style={styles.infoValue}>{formatCurrency(project.budget)}</Text>
                                </View>
                            )}

                            <View style={styles.infoItem}>
                                <View style={styles.infoLabelRow}>
                                    <Icon name="calendar" size={12} color="#757575" style={styles.infoIcon} />
                                    <Text style={styles.infoLabel}>Mulai</Text>
                                </View>
                                <Text style={styles.infoValue}>{formatDate(project.start_date)}</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <View style={styles.infoLabelRow}>
                                    <Icon name="clock" size={12} color="#757575" style={styles.infoIcon} />
                                    <Text style={styles.infoLabel}>Est. Selesai</Text>
                                </View>
                                <Text style={styles.infoValue}>{formatDate(project.estimated_finish)}</Text>
                            </View>
                        </View>
                    </View>

                    {!!project.files?.length && (
                        <View style={styles.timelineCard}>
                            <Text style={styles.timelineTitle}>Berkas Proyek</Text>
                            {project.files.map(file => <FileAttachment key={file.id} file={file} />)}
                        </View>
                    )}
                    {!!project.updates?.length && (
                        <View style={styles.timelineCard}>
                            <Text style={styles.timelineTitle}>Catatan Proyek</Text>
                            {project.updates.map(note => <Text key={note.id} style={styles.infoValue}>{note.description} ({note.progress}%)</Text>)}
                        </View>
                    )}
                    <View style={styles.timelineCard}>
                        <View style={styles.timelineHeader}>
                            <View style={styles.timelineTitleRow}>
                                <Icon name="layers" size={16} color={isMarketing ? '#0F9F67' : colors.primary} style={styles.timelineIcon} />
                                <Text style={styles.timelineTitle}>Tahapan Proyek</Text>
                            </View>

                            {canManageStagesRole(user?.role) && (
                                <TouchableOpacity
                                    style={styles.addStageBtn}
                                    onPress={() => setCreateStageModal(true)}>
                                    <Text style={styles.addStageBtnText}>+ Tahap Baru</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {project.stages.length === 0 ? (
                            <Text style={styles.noStages}>Belum ada tahapan yang didefinisikan.</Text>
                        ) : (
                            <StageTimeline
                                stages={project.stages}
                                isInternal={isInternal}
                                onUpdateStatus={(stageId, currentStatus) =>
                                    setStatusModal({ visible: true, stageId, current: currentStatus })
                                }
                                onAddNote={(stageId, title) => {
                                    setNoteModal({ visible: true, stageId, title });
                                }}
                                onUploadFile={(stageId, title) => {
                                    setFileModal({ visible: true, stageId, title });
                                }}
                                onEditStage={
                                    canManageStagesRole(user?.role)
                                        ? (stage) => setEditStageModal({ visible: true, stage })
                                        : undefined
                                }
                            />
                        )}
                    </View>
                </ScrollView>
            )}

            {isSaving && (
                <View style={styles.savingOverlay}>
                    <ActivityIndicator color="#FFF" size="large" />
                </View>
            )}

            {realtimeToast && (
                <Animated.View style={[styles.realtimeToast, { opacity: toastOpacity }]}>
                    <Text style={styles.realtimeToastText}>Data proyek diperbarui secara otomatis</Text>
                </Animated.View>
            )}

            <StatusUpdateModal
                visible={statusModal.visible}
                currentStatus={statusModal.current}
                onClose={() => setStatusModal({ visible: false, stageId: '', current: '' })}
                onSave={handleUpdateStatus}
            />

            <AddNoteModal
                visible={noteModal.visible}
                stageTitle={noteModal.title}
                onClose={() => setNoteModal({ visible: false, stageId: '', title: '' })}
                onSave={handleAddNote}
            />

            <UploadFileModal
                visible={fileModal.visible}
                stageTitle={fileModal.title}
                onClose={() => setFileModal({ visible: false, stageId: '', title: '' })}
                onSave={handleAddFile}
            />

            <CreateStageModal
                visible={createStageModal}
                onClose={() => setCreateStageModal(false)}
                onSave={handleCreateStage}
            />

            {project && (
                <EditProjectModal
                    visible={editProjectModal}
                    project={project}
                    onClose={() => setEditProjectModal(false)}
                    onSaveSuccess={() => {
                        refetch();
                        setEditProjectModal(false);
                    }}
                    onDeleteSuccess={() => navigation.goBack()}
                />
            )}

            <EditStageModal
                visible={editStageModal.visible}
                stage={editStageModal.stage}
                onClose={() => setEditStageModal({ visible: false, stage: null })}
                onSave={(title, desc) => {
                    if (editStageModal.stage) {
                        handleUpdateStageDetails(title, desc);
                    }
                }}
                onDelete={() => {
                    if (editStageModal.stage) {
                        handleDeleteStage(editStageModal.stage.id, editStageModal.stage.title);
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F8F7' },
    headerGradient: {
        paddingHorizontal: scale(16),
        paddingBottom: scale(20),
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(6),
    },
    backBtn: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: fontScale(16),
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        marginHorizontal: scale(8),
    },
    headerSubtitle: {
        fontSize: fontScale(12),
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
    },
    headerEditBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: scale(10),
        paddingVertical: scale(6),
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerEditIcon: { marginRight: scale(4) },
    headerEditText: {
        color: '#FFF',
        fontSize: fontScale(11),
        fontWeight: '700',
    },
    headerSpacer: { width: scale(36) },
    loader: { marginTop: scale(60) },
    errorState: { alignItems: 'center', justifyContent: 'center', paddingTop: scale(60) },
    errorText: { fontSize: fontScale(14), color: '#757575', marginTop: scale(8) },
    scrollContent: { paddingHorizontal: scale(16), paddingTop: scale(12), paddingBottom: scale(32) },
    infoCard: {
        backgroundColor: '#FFF',
        borderRadius: scale(12),
        padding: scale(16),
        marginBottom: scale(12),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    infoCardMarketingBorder: {
        borderLeftColor: '#0F9F67',
    },
    infoCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: scale(12),
    },
    infoCardTitleCol: { flex: 1, marginRight: scale(12) },
    projectCode: {
        fontSize: fontScale(10),
        color: '#757575',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: scale(2),
    },
    projectName: {
        fontSize: fontScale(16),
        fontWeight: '800',
        color: '#212121',
        lineHeight: scale(22),
    },
    divider: { height: 1, backgroundColor: '#EEEEEE', marginBottom: scale(12) },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    infoItem: {
        width: '50%',
        marginBottom: scale(12),
    },
    infoLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(2),
    },
    infoIcon: { marginRight: scale(4) },
    infoLabel: {
        fontSize: fontScale(10),
        color: '#757575',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    infoValue: {
        fontSize: fontScale(13),
        fontWeight: '600',
        color: '#212121',
    },
    timelineCard: {
        backgroundColor: '#FFF',
        borderRadius: scale(12),
        padding: scale(16),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(12),
    },
    timelineTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timelineIcon: { marginRight: scale(6) },
    timelineTitle: {
        fontSize: fontScale(15),
        fontWeight: '800',
        color: '#212121',
    },
    addStageBtn: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: scale(10),
        paddingVertical: scale(5),
        borderRadius: scale(8),
    },
    addStageBtnText: {
        fontSize: fontScale(11),
        fontWeight: '700',
        color: '#0F9F67',
    },
    noStages: { fontSize: fontScale(13), color: '#757575', textAlign: 'center', paddingVertical: scale(20) },
    savingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    realtimeToast: {
        position: 'absolute',
        top: scale(100),
        alignSelf: 'center',
        backgroundColor: '#0F9F67',
        paddingHorizontal: scale(18),
        paddingVertical: scale(10),
        borderRadius: scale(24),
        zIndex: 9998,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    realtimeToastText: {
        color: '#FFF',
        fontSize: fontScale(12),
        fontWeight: '600',
    },
});

export default ProjectDetailScreen;
