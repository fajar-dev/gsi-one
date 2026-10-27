import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Alert, Animated } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { ProjectFileType, ProjectStageStatus, ProjectStage } from '../services/projectService';
import useProjectRealtime from './useProjectRealtime';
import { ProjectEntity } from '../domain/entities/ProjectEntity';
import { isInternalRole, canEditProjectRole } from '../domain/enums/UserRole';
import { getErrorMessage } from '../utils/errorHelpers';
import { formatDateDisplay as formatDate, formatCurrency } from '../utils/formatters';


export type StatusModalState = { visible: boolean; stageId: string; current: ProjectStageStatus | '' };
export type FileModalState = { visible: boolean; stageId: string; title: string };
export type NoteModalState = { visible: boolean; stageId: string; title: string };
export type EditStageModalState = { visible: boolean; stage: ProjectStage | null };

export function useProjectDetail(projectId: string) {
    const { user } = useAuthStore();
    const isMarketing = user?.role === 'marketing';
    const isClient = user?.role === 'client';
    const isInternal = isInternalRole(user?.role);
    const canEditProject = canEditProjectRole(user?.role);

    const {
        selectedProject: rawProject,
        isLoadingDetail,
        error: detailError,
        fetchProjectDetail,
        updateStageStatus,
        addStageUpdate,
        uploadFile,
        createProjectStage,
        updateProjectStage,
        deleteProjectStage,
    } = useProjectStore();

    const projectEntity = useMemo(
        () => rawProject ? new ProjectEntity(rawProject) : null,
        [rawProject]
    );

    const [statusModal, setStatusModal] = useState<StatusModalState>({ visible: false, stageId: '', current: '' });
    const [noteModal, setNoteModal] = useState<NoteModalState>({ visible: false, stageId: '', title: '' });
    const [fileModal, setFileModal] = useState<FileModalState>({ visible: false, stageId: '', title: '' });
    const [createStageModal, setCreateStageModal] = useState(false);
    const [editProjectModal, setEditProjectModal] = useState(false);
    const [editStageModal, setEditStageModal] = useState<EditStageModalState>({ visible: false, stage: null });

    const [isSaving, setIsSaving] = useState(false);
    const [realtimeToast, setRealtimeToast] = useState(false);
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        fetchProjectDetail(projectId);
    }, [fetchProjectDetail, projectId]);

    useEffect(() => () => {
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }
    }, []);

    const handleRealtimeUpdate = useCallback(() => {
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }
        refreshTimeoutRef.current = setTimeout(() => {
            fetchProjectDetail(projectId);
            setRealtimeToast(true);
            Animated.sequence([
                Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.delay(2000),
                Animated.timing(toastOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]).start(() => setRealtimeToast(false));
        }, 600);
    }, [fetchProjectDetail, projectId, toastOpacity]);

    useProjectRealtime({
        projectId,
        onStageUpdate: handleRealtimeUpdate,
        onProjectUpdate: handleRealtimeUpdate,
        enabled: true,
    });

    const handleUpdateStatus = async (newStatus: ProjectStageStatus) => {
        const stageId = statusModal.stageId;
        setStatusModal(prev => ({ ...prev, visible: false }));
        setIsSaving(true);
        try {
            await updateStageStatus(stageId, newStatus);
        } catch (err: unknown) {
            Alert.alert('Gagal Update Status', getErrorMessage(err, 'Terjadi kesalahan saat memperbarui status'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddNote = async (desc: string, progressStr: string) => {
        const stageId = noteModal.stageId;
        setNoteModal(prev => ({ ...prev, visible: false }));
        setIsSaving(true);
        try {
            const parsedProg = progressStr.trim() ? parseInt(progressStr.trim(), 10) : 0;
            const prog = isNaN(parsedProg) ? 0 : Math.min(100, Math.max(0, parsedProg));
            await addStageUpdate(stageId, desc.trim(), prog);
        } catch (err: unknown) {
            Alert.alert('Gagal Tambah Catatan', getErrorMessage(err, 'Terjadi kesalahan saat menyimpan catatan'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleUploadFile = async (name: string, type: ProjectFileType, fileUri?: string) => {
        const stageId = fileModal.stageId || null;
        setFileModal(prev => ({ ...prev, visible: false }));
        setIsSaving(true);
        try {
            await uploadFile(projectId, stageId, name.trim(), type, fileUri);
            Alert.alert('Berhasil', `Berkas "${name}" berhasil diunggah.`);
        } catch (err: unknown) {
            Alert.alert('Gagal Unggah Berkas', getErrorMessage(err, 'Terjadi kesalahan saat mengunggah berkas'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateStage = async (title: string, desc: string) => {
        setCreateStageModal(false);
        setIsSaving(true);
        try {
            await createProjectStage(projectId, title.trim(), desc.trim());
            Alert.alert('Berhasil', `Tahapan "${title}" berhasil ditambahkan.`);
        } catch (err: unknown) {
            Alert.alert('Gagal Tambah Tahapan', getErrorMessage(err, 'Terjadi kesalahan saat membuat tahapan baru'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateStageInfo = async (title: string, desc: string) => {
        const stageId = editStageModal.stage?.id;
        if (!stageId) return;
        setEditStageModal({ visible: false, stage: null });
        setIsSaving(true);
        try {
            await updateProjectStage(stageId, { title, description: desc });
            Alert.alert('Berhasil', `Tahapan "${title}" berhasil diperbarui.`);
        } catch (err: unknown) {
            Alert.alert('Gagal Ubah Tahapan', getErrorMessage(err, 'Terjadi kesalahan saat memperbarui tahapan'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteStage = (stageId: string, stageTitle: string) => {
        Alert.alert(
            'Hapus Tahapan',
            `Apakah Anda yakin ingin menghapus tahapan "${stageTitle}"? Catatan dan berkas tetap tersedia di bagian Catatan Proyek dan Berkas Proyek.`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        setIsSaving(true);
                        try {
                            await deleteProjectStage(stageId);
                            Alert.alert('Berhasil', `Tahapan "${stageTitle}" telah dihapus.`);
                        } catch (err: unknown) {
                            Alert.alert('Gagal Hapus', getErrorMessage(err, 'Gagal menghapus tahapan'));
                        } finally {
                            setIsSaving(false);
                        }
                    },
                },
            ]
        );
    };

    return {
        user,
        isMarketing,
        isClient,
        isInternal,
        canEditProject,
        projectEntity,
        project: rawProject,
        rawProject,
        isLoadingDetail,
        error: detailError,
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
        handleUploadFile,
        handleAddFile: handleUploadFile,
        handleCreateStage,
        handleUpdateStageInfo,
        handleUpdateStageDetails: handleUpdateStageInfo,
        handleDeleteStage,
        formatDate,
        formatCurrency,
        refetch: () => fetchProjectDetail(projectId),
    };
}
