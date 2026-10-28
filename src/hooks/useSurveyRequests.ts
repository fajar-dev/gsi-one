import { getErrorMessage } from '../utils/errorHelpers';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Linking } from 'react-native';
import { useAuthStore } from '../store/authStore';
import {
  SurveyRequestEntity,
  SurveyRequestData,
} from '../domain/entities/SurveyRequestEntity';
import { surveyService } from '../services/surveyService';
import {
  canManageSurveyBookingsRole,
  canViewSurveysRole,
} from '../domain/enums/UserRole';

export type SurveyFilterType = 'all' | 'pending' | 'claimed';

export function useSurveyRequests() {
  const { user } = useAuthStore();
  const [entities, setEntities] = useState<SurveyRequestEntity[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<SurveyFilterType>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const pendingMutations = useRef(new Set<number>());
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef({ id: 0 });

  const fetchRequests = useCallback(async () => {
    const request = ++requestId.current.id;
    if (!canViewSurveysRole(user?.role)) {
      setEntities([]);
      setIsLoading(false);
      setError(null);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const data: SurveyRequestData[] = await surveyService.getBookings();
      if (request === requestId.current.id)
        setEntities(data.map(d => new SurveyRequestEntity(d)));
    } catch (err: unknown) {
      if (request === requestId.current.id) setError(getErrorMessage(err));
    } finally {
      if (request === requestId.current.id) setIsLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    setEntities([]);
    fetchRequests();
    const tracker = requestId.current;
    return () => {
      tracker.id++;
    };
  }, [fetchRequests, user?.id]);

  const persistedBookingId = (entity: SurveyRequestEntity): number | null => {
    const id = entity.rawDbId;
    if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) {
      Alert.alert(
        'Data Survei Tidak Valid',
        'Identitas data survei tidak ditemukan. Muat ulang daftar sebelum mencoba lagi.',
      );
      return null;
    }
    return id;
  };

  const handleClaim = (entity: SurveyRequestEntity) => {
    if (!canViewSurveysRole(user?.role)) {
      Alert.alert(
        'Akses Ditolak',
        'Hanya Admin dan Marketing yang dapat mengambil pengajuan survei.',
      );
      return;
    }
    const id = persistedBookingId(entity);
    if (id === null) return;
    const roleTitle = user?.role === 'admin' ? 'Admin' : 'Marketing';
    const userName = user?.full_name || `${roleTitle} GSI`;
    Alert.alert(
      'Konfirmasi Ambil Survey',
      `Apakah Anda yakin ingin mengambil & menghubungi ${entity.clientName} (${entity.companyName})?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Ambil',
          onPress: async () => {
            if (pendingMutations.current.has(id)) return;
            pendingMutations.current.add(id);
            setIsMutating(true);
            try {
              await surveyService.claimBooking(id, {
                status: 'claimed',
                claimed_by: `${userName} (${roleTitle})`,
                claimed_at: new Date().toISOString(),
              });
              await fetchRequests();
              Alert.alert(
                'Berhasil',
                `Pengajuan survey ${entity.id} berhasil Anda ambil.`,
              );
            } catch (requestError: unknown) {
              Alert.alert(
                'Gagal Mengklaim',
                getErrorMessage(
                  requestError,
                  'Terjadi kesalahan saat menyimpan status klaim ke database.',
                ),
              );
              await fetchRequests();
            } finally {
              pendingMutations.current.delete(id);
              setIsMutating(pendingMutations.current.size > 0);
            }
          },
        },
      ],
    );
  };

  const handleCallPhone = (entity: SurveyRequestEntity) => {
    Linking.openURL(entity.getPhoneUrl()).catch(() => {
      Alert.alert('Info', `Nomor telepon: ${entity.phone}`);
    });
  };

  const handleOpenWhatsApp = (entity: SurveyRequestEntity) => {
    Linking.openURL(entity.getWhatsAppUrl()).catch(() => {
      Alert.alert('Info', `Silakan hubungi WhatsApp ke: ${entity.phone}`);
    });
  };

  const filteredRequests = entities.filter(item => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'pending'
        ? item.isPending()
        : item.isClaimed();

    const q = search.toLowerCase();
    const matchesSearch =
      item.clientName.toLowerCase().includes(q) ||
      item.companyName.toLowerCase().includes(q) ||
      item.structureType.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  let pendingCount = 0;
  let claimedCount = 0;
  for (const e of entities) {
    if (e.isPending()) pendingCount++;
    else if (e.isClaimed()) claimedCount++;
  }
  const totalCount = entities.length;

  const handleDelete = (entity: SurveyRequestEntity) => {
    if (!canManageSurveyBookingsRole(user?.role)) {
      Alert.alert(
        'Akses Ditolak',
        'Hanya Admin yang memiliki hak akses untuk menghapus pengajuan survey.',
      );
      return;
    }
    const id = persistedBookingId(entity);
    if (id === null) return;
    Alert.alert(
      'Konfirmasi Hapus Survey',
      `Apakah Anda yakin ingin menghapus pengajuan survey dari ${entity.clientName} (${entity.companyName})?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await surveyService.deleteBooking(id);
              await fetchRequests();
              Alert.alert(
                'Berhasil',
                `Pengajuan survey ${entity.id} telah dihapus.`,
              );
            } catch (requestError: unknown) {
              Alert.alert(
                'Gagal',
                getErrorMessage(
                  requestError,
                  'Gagal menghapus pengajuan survey dari database.',
                ),
              );
            }
          },
        },
      ],
    );
  };

  return {
    user,
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    isLoading: isLoading || isMutating,
    error,
    refreshRequests: fetchRequests,
    filteredRequests,
    totalCount,
    pendingCount,
    claimedCount,
    handleClaim,
    handleDelete,
    handleCallPhone,
    handleOpenWhatsApp,
  };
}
