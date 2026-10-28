import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useProjectStore } from '../../../store/projectStore';
import type {
  ProjectDetail,
  ProjectStatus,
} from '../../../domain/models/project';
import { projectService } from '../../../services/projectService';
import { getErrorMessage } from '../../../utils/errorHelpers';
import { formatDateDisplay, formatDateDb } from '../../../utils/formatters';

export type UserOption = { id: string; name: string; email: string };

export { getErrorMessage, formatDateDisplay, formatDateDb };

export const PROJECT_STATUS_OPTIONS = [
  { id: 'pending', name: 'Menunggu', email: 'Proyek baru didaftarkan' },
  { id: 'on_progress', name: 'Berjalan', email: 'Proyek sedang dikerjakan' },
  { id: 'done', name: 'Selesai', email: 'Seluruh tahapan rampung' },
  { id: 'on_hold', name: 'Ditunda', email: 'Pekerjaan dihentikan sementara' },
];

export interface UseEditProjectFormProps {
  visible: boolean;
  project: ProjectDetail;
  onClose: () => void;
  onSaveSuccess: () => void;
  onDeleteSuccess: () => void;
}

export function useEditProjectForm({
  visible,
  project,
  onClose,
  onSaveSuccess,
  onDeleteSuccess,
}: UseEditProjectFormProps) {
  const { updateProject, deleteProject } = useProjectStore();
  const [isSaving, setIsSaving] = useState(false);

  const [projectCode, setProjectCode] = useState('');
  const [projectName, setProjectName] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<ProjectStatus>('pending');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [clientsList, setClientsList] = useState<UserOption[]>([]);
  const [marketingsList, setMarketingsList] = useState<UserOption[]>([]);
  const [engineersList, setEngineersList] = useState<UserOption[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);

  const [selectedClient, setSelectedClient] = useState<UserOption | null>(null);
  const [selectedMarketing, setSelectedMarketing] = useState<UserOption | null>(
    null,
  );
  const [selectedEngineer, setSelectedEngineer] = useState<UserOption | null>(
    null,
  );

  const [pickerModal, setPickerModal] = useState<{
    visible: boolean;
    type: 'client' | 'marketing' | 'engineer' | 'status' | '';
    title: string;
    data: UserOption[];
  }>({ visible: false, type: '', title: '', data: [] });

  useEffect(() => {
    let active = true;
    if (visible && project) {
      setProjectCode(project.project_code || '');
      setProjectName(project.project_name || '');
      setBudget(project.budget != null ? String(project.budget) : '');
      setStartDate(project.start_date ? new Date(project.start_date) : null);
      setEndDate(
        project.estimated_finish ? new Date(project.estimated_finish) : null,
      );
      setStatus(project.status || 'pending');
      setSelectedClient(null);
      setSelectedMarketing(null);
      setSelectedEngineer(null);
      setShowStartPicker(false);
      setShowEndPicker(false);

      const fetchLists = async () => {
        setIsLoadingLists(true);
        try {
          const [clients, marketings, engineers] = await Promise.all([
            projectService.getUsersByRole('client'),
            projectService.getUsersByRole('marketing'),
            projectService.getUsersByRole('engineer'),
          ]);
          if (!active) return;
          setClientsList(clients);
          setMarketingsList(marketings);
          setEngineersList(engineers);

          const client = clients.find(
            c => c.id === project.client_id || c.name === project.client_name,
          );
          if (client) setSelectedClient(client);
          else if (project.client_name)
            setSelectedClient({
              id: project.client_id || '',
              name: project.client_name,
              email: '',
            });

          const marketing = marketings.find(m => m.id === project.marketing_id);
          if (marketing) setSelectedMarketing(marketing);

          const engineer = engineers.find(e => e.id === project.engineer_id);
          if (engineer) setSelectedEngineer(engineer);
        } catch (err: unknown) {
          if (!active) return;
          Alert.alert(
            'Error',
            getErrorMessage(err, 'Gagal memuat daftar Klien/Staff'),
          );
        } finally {
          if (active) setIsLoadingLists(false);
        }
      };

      fetchLists();
    }
    return () => {
      active = false;
    };
  }, [visible, project]);

  const handleDelete = () => {
    Alert.alert(
      'Hapus Proyek',
      'Apakah Anda yakin ingin menghapus proyek ini? Semua data tahapan, catatan, dan berkas proyek ini akan dihapus permanen.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setIsSaving(true);
            try {
              await deleteProject(project.id);
              onClose();
              onDeleteSuccess();
            } catch (err: unknown) {
              Alert.alert(
                'Error',
                getErrorMessage(err, 'Gagal menghapus proyek'),
              );
            } finally {
              setIsSaving(false);
            }
          },
        },
      ],
    );
  };

  const handleSave = async () => {
    if (!projectCode.trim()) {
      Alert.alert('Validasi', 'Kode proyek wajib diisi');
      return;
    }
    if (!projectName.trim()) {
      Alert.alert('Validasi', 'Nama proyek wajib diisi');
      return;
    }
    if (!selectedClient) {
      Alert.alert('Validasi', 'Klien wajib dipilih');
      return;
    }
    if (!selectedMarketing) {
      Alert.alert('Validasi', 'Marketing penanggung jawab wajib dipilih');
      return;
    }
    if (!selectedEngineer) {
      Alert.alert('Validasi', 'Engineer penanggung jawab wajib dipilih');
      return;
    }
    const budgetVal = parseFloat(budget.replace(/[^0-9]/g, ''));
    if (isNaN(budgetVal) || budgetVal <= 0) {
      Alert.alert('Validasi', 'Anggaran harus bernilai lebih dari 0');
      return;
    }
    if (!startDate) {
      Alert.alert('Validasi', 'Tanggal mulai wajib dipilih');
      return;
    }
    if (!endDate) {
      Alert.alert('Validasi', 'Tanggal estimasi selesai wajib dipilih');
      return;
    }
    if (endDate < startDate) {
      Alert.alert(
        'Validasi',
        'Tanggal selesai tidak boleh sebelum tanggal mulai',
      );
      return;
    }

    setIsSaving(true);
    try {
      await updateProject(project.id, {
        project_code: projectCode.trim().toUpperCase(),
        project_name: projectName.trim(),
        client_name: selectedClient.name,
        client_id: selectedClient.id || undefined,
        marketing_id: selectedMarketing.id,
        engineer_id: selectedEngineer.id,
        budget: budgetVal,
        start_date: formatDateDb(startDate),
        estimated_finish: formatDateDb(endDate),
        status,
      });
      onClose();
      onSaveSuccess();
    } catch (err: unknown) {
      Alert.alert('Error', getErrorMessage(err, 'Gagal mengedit proyek'));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    projectCode,
    setProjectCode,
    projectName,
    setProjectName,
    budget,
    setBudget,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    showStartPicker,
    setShowStartPicker,
    showEndPicker,
    setShowEndPicker,
    clientsList,
    marketingsList,
    engineersList,
    isLoadingLists,
    selectedClient,
    setSelectedClient,
    selectedMarketing,
    setSelectedMarketing,
    selectedEngineer,
    setSelectedEngineer,
    pickerModal,
    setPickerModal,
    isSaving,
    handleSave,
    handleDelete,
  };
}
