import { useState, useEffect, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { SurveyRequestEntity, SurveyRequestData } from '../domain/entities/SurveyRequestEntity';
import { surveyService } from '../services/surveyService';
import { canManageSurveyBookingsRole } from '../domain/enums/UserRole';

export type SurveyRequestItem = SurveyRequestEntity;

export type SurveyFilterType = 'all' | 'pending' | 'claimed';

export function useSurveyRequests() {
    const { user } = useAuthStore();
    const [entities, setEntities] = useState<SurveyRequestEntity[]>([]);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<SurveyFilterType>('all');
    const [isLoading, setIsLoading] = useState(false);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const data: SurveyRequestData[] = await surveyService.getBookings();
            setEntities(data.map(d => new SurveyRequestEntity(d)));
        } catch {
            setEntities([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleClaim = (entity: SurveyRequestEntity) => {
        const roleTitle = user?.role === 'admin' ? 'Admin' : 'Marketing';
        const uName = user?.full_name || `${roleTitle} GSI`;
        Alert.alert(
            'Konfirmasi Ambil Survey',
            `Apakah Anda yakin ingin mengambil & menghubungi ${entity.clientName} (${entity.companyName})?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Ya, Ambil',
                    onPress: async () => {
                        const dbId = entity.rawDbId;
                        if (dbId !== undefined) {
                            try {
                                setIsLoading(true);
                                await surveyService.claimBooking(dbId, {
                                    status: 'claimed',
                                    claimed_by: `${uName} (${roleTitle})`,
                                    claimed_at: new Date().toISOString(),
                                });
                                await fetchRequests();
                                Alert.alert('Berhasil', `Pengajuan survey ${entity.id} berhasil Anda ambil.`);
                            } catch (error: any) {
                                Alert.alert('Gagal Mengklaim', error?.message || 'Terjadi kesalahan saat menyimpan status klaim ke database.');
                                fetchRequests();
                            } finally {
                                setIsLoading(false);
                            }
                        } else {
                            setEntities(prev =>
                                prev.map(item => (item.id === entity.id ? item.claimBy(uName, roleTitle) : item))
                            );
                            Alert.alert('Berhasil', `Pengajuan survey ${entity.id} berhasil Anda ambil.`);
                        }
                    },
                },
            ]
        );
    };

    const handleCallPhone = (phone: string) => {
        Linking.openURL(`tel:${phone}`).catch(() => {
            Alert.alert('Info', `Nomor telepon: ${phone}`);
        });
    };

    const handleWhatsApp = (entity: SurveyRequestEntity) => {
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
            Alert.alert('Akses Ditolak', 'Hanya Admin yang memiliki hak akses untuk menghapus pengajuan survey.');
            return;
        }

        Alert.alert(
            'Konfirmasi Hapus Survey',
            `Apakah Anda yakin ingin menghapus pengajuan survey dari ${entity.clientName} (${entity.companyName})?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        setEntities(prev => prev.filter(item => item.id !== entity.id));

                        const dbId = entity.rawDbId;
                        if (dbId !== undefined) {
                            try {
                                await surveyService.deleteBooking(dbId);
                            } catch {
                                Alert.alert('Gagal', 'Gagal menghapus pengajuan survey dari database.');
                                fetchRequests(); 
                                return;
                            }
                        }

                        Alert.alert('Berhasil', `Pengajuan survey ${entity.id} telah dihapus.`);
                    },
                },
            ]
        );
    };

    return {
        user,
        search,
        setSearch,
        activeFilter,
        setActiveFilter,
        isLoading,
        refreshRequests: fetchRequests,
        filteredRequests,
        totalCount,
        pendingCount,
        claimedCount,
        handleClaim,
        handleDelete,
        handleCallPhone,
        handleWhatsApp,
        handleOpenWhatsApp: handleWhatsApp,
    };
}
