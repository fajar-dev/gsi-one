import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useProjectStore } from '../../../store/projectStore';
import { projectService } from '../../../services/projectService';
import { surveyService } from '../../../services/surveyService';
import { getErrorMessage } from '../../../utils/errorHelpers';
import { formatDateDb } from '../../../utils/formatters';

export type UserOption = { id: string; name: string; email: string };

export function useCreateProjectForm(
  onSuccess?: () => void,
  initialValues?: {
    initialProjectName?: string;
    initialClientName?: string;
    initialServiceType?: string;
    surveyBookingId?: number;
  },
) {
  const currentYear = new Date().getFullYear();
  const projectCodePrefix = `GSI-${currentYear}-`;

  const { createProject, fetchProjects } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);

  const [projectCodeSuffix, setProjectCodeSuffix] = useState('');
  const [projectName, setProjectName] = useState(
    initialValues?.initialProjectName || '',
  );
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [clientNotRegisteredNotice, setClientNotRegisteredNotice] = useState<
    string | null
  >(null);

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
    type: 'client' | 'marketing' | 'engineer' | '';
    title: string;
    data: UserOption[];
  }>({ visible: false, type: '', title: '', data: [] });

  useEffect(() => {
    const fetchLists = async () => {
      setIsLoadingLists(true);
      try {
        const [clients, marketings, engineers] = await Promise.all([
          projectService.getUsersByRole('client'),
          projectService.getUsersByRole('marketing'),
          projectService.getUsersByRole('engineer'),
        ]);
        setClientsList(clients);
        setMarketingsList(marketings);
        setEngineersList(engineers);

        if (initialValues?.initialClientName) {
          const targetName = initialValues.initialClientName.toLowerCase();
          const match = clients.find(
            c =>
              c.name.toLowerCase().includes(targetName) ||
              targetName.includes(c.name.toLowerCase()),
          );
          if (match) {
            setSelectedClient(match);
            setClientNotRegisteredNotice(null);
          } else {
            setSelectedClient(null);
            setClientNotRegisteredNotice(
              `Akun Klien "${initialValues.initialClientName}" belum didaftarkan oleh Admin di aplikasi GSI. Silakan daftarkan akun Klien terlebih dahulu sebelum membuat proyek.`,
            );
          }
        }
      } catch (err: unknown) {
        Alert.alert(
          'Error',
          getErrorMessage(err, 'Gagal memuat daftar Klien/Staff'),
        );
      } finally {
        setIsLoadingLists(false);
      }
    };

    fetchLists();
  }, [initialValues?.initialClientName]);

  const resetForm = () => {
    setProjectCodeSuffix('');
    setProjectName('');
    setBudget('');
    setStartDate(null);
    setEndDate(null);
    setSelectedClient(null);
    setSelectedMarketing(null);
    setSelectedEngineer(null);
    setClientNotRegisteredNotice(null);
    setIsLoading(false);
  };

  const getFullProjectCode = (suffix: string) => {
    let clean = suffix.trim().toUpperCase();
    if (clean.startsWith(projectCodePrefix)) {
      clean = clean.substring(projectCodePrefix.length);
    } else if (clean.startsWith(`GSI-${currentYear}`)) {
      clean = clean.substring(`GSI-${currentYear}`.length).replace(/^-/, '');
    } else if (clean.startsWith('GSI-')) {
      clean = clean.substring(4);
    }
    return `${projectCodePrefix}${clean}`;
  };

  const handleStartDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
    }
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowEndPicker(false);
    }
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!projectCodeSuffix.trim()) {
      Alert.alert('Validasi', 'Kode proyek (sufiks) wajib diisi');
      return;
    }
    if (!projectName.trim()) {
      Alert.alert('Validasi', 'Nama proyek wajib diisi');
      return;
    }
    if (initialValues?.initialClientName && clientNotRegisteredNotice) {
      Alert.alert(
        'Akun Klien Belum Didaftarkan',
        `Akun Klien untuk permohonan survey "${initialValues.initialClientName}" belum dibuat / didaftarkan oleh Admin di aplikasi GSI.\n\nSilakan daftarkan akun Klien terlebih dahulu sebelum proyek dapat dibuat.`,
      );
      return;
    }
    if (!selectedClient) {
      Alert.alert(
        'Klien Belum Terdaftar / Dipilih',
        'Proyek hanya dapat dibuat setelah Admin mendaftarkan Klien sebagai pengguna aplikasi GSI. Silakan daftarkan akun Klien terlebih dahulu atau pilih akun Klien yang sudah terdaftar.',
      );
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
      Alert.alert('Validasi', 'Anggaran proyek harus bernilai lebih dari 0');
      return;
    }
    if (!startDate) {
      Alert.alert('Validasi', 'Tanggal mulai proyek wajib dipilih');
      return;
    }
    if (!endDate) {
      Alert.alert('Validasi', 'Tanggal estimasi selesai wajib dipilih');
      return;
    }
    if (endDate < startDate) {
      Alert.alert(
        'Validasi',
        'Tanggal estimasi selesai tidak boleh sebelum tanggal mulai',
      );
      return;
    }

    const fullProjectCode = getFullProjectCode(projectCodeSuffix);

    setIsLoading(true);
    try {
      await createProject({
        project_code: fullProjectCode,
        project_name: projectName.trim(),
        client_name: selectedClient.name,
        budget: budgetVal,
        start_date: formatDateDb(startDate),
        estimated_finish: formatDateDb(endDate),
        created_by: '',
        client_id: selectedClient.id,
        marketing_id: selectedMarketing.id,
        engineer_id: selectedEngineer.id,
      });

      if (initialValues?.surveyBookingId) {
        try {
          await surveyService.deleteBooking(initialValues.surveyBookingId);
        } catch (deleteErr) {
          if (__DEV__) {
            console.warn(
              'Gagal menghapus booking survey terkonversi:',
              deleteErr,
            );
          }
        }
      }

      await fetchProjects();
      Alert.alert(
        'Sukses',
        `Proyek baru (${fullProjectCode}) berhasil didaftarkan!`,
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              if (onSuccess) onSuccess();
            },
          },
        ],
      );
    } catch (err: unknown) {
      Alert.alert(
        'Gagal',
        getErrorMessage(err, 'Terjadi kesalahan saat menyimpan proyek baru'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fullCodePreview = getFullProjectCode(projectCodeSuffix);

  return {
    projectCodePrefix,
    projectCodeSuffix,
    setProjectCodeSuffix,
    projectName,
    setProjectName,
    budget,
    setBudget,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
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
    isLoading,
    handleStartDateChange,
    handleEndDateChange,
    clientNotRegisteredNotice,
    handleSave,
    fullCodePreview,
    resetForm,
  };
}
