import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './ProjectDetailScreen.styles';
import { palette } from '../../theme/tokens';
import { JSX } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { scale } from '../../utils/responsive';
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
} from './components/modals';
import EditProjectModal from './components/EditProjectModal';
import { EditStageModal } from './components/EditStageModal';

type RouteProps = RouteProp<RootStackParamList, 'ProjectDetail'>;

function ProjectDetailScreen(): JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

  const headerGradientColors: [string, string] = ['#002239', palette.brand];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={headerGradientColors}
        style={[
          styles.headerGradient,
          { paddingTop: insets.top > 0 ? insets.top + scale(8) : scale(16) },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTopRow}>
          <ActionButton
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Icon name="arrow-left" size={scale(20)} color={palette.white} />
          </ActionButton>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {projectName}
          </Text>
          {canEditProject ? (
            <ActionButton
              compact
              onPress={() => setEditProjectModal(true)}
              style={styles.headerEditBtn}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Icon
                name="edit-2"
                size={12}
                color={palette.white}
                style={styles.headerEditIcon}
              />
              <Text style={styles.headerEditText}>Edit</Text>
            </ActionButton>
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>
        <Text style={styles.headerSubtitle}>
          {project?.project_code
            ? `Kode: ${project.project_code} • Detail & Tahapan Proyek`
            : 'Detail Informasi & Tahapan Proyek'}
        </Text>
      </LinearGradient>

      {isLoadingDetail ? (
        <ActivityIndicator color={palette.brand} style={styles.loader} />
      ) : !project || String(project.id) !== String(projectId) ? (
        <View style={styles.errorState}>
          <Icon name="alert-circle" size={40} color="#BDBDBD" />
          <Text style={styles.errorText}>
            {error || 'Proyek tidak ditemukan.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.infoCard,
              isMarketing && styles.infoCardMarketingBorder,
            ]}
          >
            <View style={styles.infoCardHeader}>
              <View style={styles.infoCardTitleCol}>
                {!isClient && (
                  <Text style={styles.projectCode}>{project.project_code}</Text>
                )}
                <Text style={styles.projectName}>{project.project_name}</Text>
              </View>
              <StatusBadge status={project.status} />
            </View>

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoLabelRow}>
                  <Icon
                    name="user"
                    size={12}
                    color={palette.textSecondary}
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Klien</Text>
                </View>
                <Text style={styles.infoValue}>
                  {project.client_name ?? '-'}
                </Text>
              </View>

              {!isClient && (
                <View style={styles.infoItem}>
                  <View style={styles.infoLabelRow}>
                    <Icon
                      name="credit-card"
                      size={12}
                      color={palette.textSecondary}
                      style={styles.infoIcon}
                    />
                    <Text style={styles.infoLabel}>Anggaran</Text>
                  </View>
                  <Text style={styles.infoValue}>
                    {formatCurrency(project.budget)}
                  </Text>
                </View>
              )}

              <View style={styles.infoItem}>
                <View style={styles.infoLabelRow}>
                  <Icon
                    name="calendar"
                    size={12}
                    color={palette.textSecondary}
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Mulai</Text>
                </View>
                <Text style={styles.infoValue}>
                  {formatDate(project.start_date)}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoLabelRow}>
                  <Icon
                    name="clock"
                    size={12}
                    color={palette.textSecondary}
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Est. Selesai</Text>
                </View>
                <Text style={styles.infoValue}>
                  {formatDate(project.estimated_finish)}
                </Text>
              </View>
            </View>
          </View>

          {!!project.files?.length && (
            <View style={styles.timelineCard}>
              <Text style={styles.timelineTitle}>Berkas Proyek</Text>
              {project.files.map(file => (
                <FileAttachment key={file.id} file={file} />
              ))}
            </View>
          )}
          {!!project.updates?.length && (
            <View style={styles.timelineCard}>
              <Text style={styles.timelineTitle}>Catatan Proyek</Text>
              {project.updates.map(note => (
                <Text key={note.id} style={styles.infoValue}>
                  {note.description} ({note.progress}%)
                </Text>
              ))}
            </View>
          )}
          <View style={styles.timelineCard}>
            <View style={styles.timelineHeader}>
              <View style={styles.timelineTitleRow}>
                <Icon
                  name="layers"
                  size={16}
                  color={isMarketing ? palette.brand : colors.primary}
                  style={styles.timelineIcon}
                />
                <Text style={styles.timelineTitle}>Tahapan Proyek</Text>
              </View>

              {canManageStagesRole(user?.role) && (
                <ActionButton
                  compact
                  style={styles.addStageBtn}
                  onPress={() => setCreateStageModal(true)}
                  accessibilityRole="button"
                >
                  <Text style={styles.addStageBtnText}>+ Tahap Baru</Text>
                </ActionButton>
              )}
            </View>

            {project.stages.length === 0 ? (
              <Text style={styles.noStages}>
                Belum ada tahapan yang didefinisikan.
              </Text>
            ) : (
              <StageTimeline
                stages={project.stages}
                isInternal={isInternal}
                onUpdateStatus={(stageId, currentStatus) =>
                  setStatusModal({
                    visible: true,
                    stageId,
                    current: currentStatus,
                  })
                }
                onAddNote={(stageId, title) => {
                  setNoteModal({ visible: true, stageId, title });
                }}
                onUploadFile={(stageId, title) => {
                  setFileModal({ visible: true, stageId, title });
                }}
                onEditStage={
                  canManageStagesRole(user?.role)
                    ? stage => setEditStageModal({ visible: true, stage })
                    : undefined
                }
              />
            )}
          </View>
        </ScrollView>
      )}

      {isSaving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator color={palette.white} size="large" />
        </View>
      )}

      {realtimeToast && (
        <Animated.View
          style={[styles.realtimeToast, { opacity: toastOpacity }]}
        >
          <Text style={styles.realtimeToastText}>
            Data proyek diperbarui secara otomatis
          </Text>
        </Animated.View>
      )}

      <StatusUpdateModal
        visible={statusModal.visible}
        currentStatus={statusModal.current}
        onClose={() =>
          setStatusModal({ visible: false, stageId: '', current: '' })
        }
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
            handleDeleteStage(
              editStageModal.stage.id,
              editStageModal.stage.title,
            );
          }
        }}
      />
    </View>
  );
}

export default ProjectDetailScreen;
