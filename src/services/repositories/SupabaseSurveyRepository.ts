import { supabase } from '../../config/supabase';
import { SurveyRequestData } from '../../domain/entities/SurveyRequestEntity';
import { ISurveyRepository, CreateBookingData, ClaimBookingData } from './ISurveyRepository';
import { BookingRow } from '../../types/database.types';


export class SupabaseSurveyRepository implements ISurveyRepository {
    async getBookings(): Promise<SurveyRequestData[]> {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message || 'Gagal mengambil data pengajuan survey');
        }

        if (!data) {
            return [];
        }

        return (data as BookingRow[]).map(b => ({
            id: `SRV-${String(b.id).padStart(3, '0')}`,
            rawDbId: b.id, 
            clientName: b.full_name || 'Klien GSI',
            companyName: b.company_name || 'Personal / Perorangan',
            phone: b.phone || '-',
            email: b.email || '-',
            structureType: b.service_type || 'General Structural Assessment',
            location: b.location || 'Indonesia',
            submittedDate: b.created_at
                ? new Date(b.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                  })
                : 'Baru saja',
            notes: b.message || 'Permohonan survey baru dari formulir booking online GSI One.',
            status: b.status === 'claimed' || b.status === 'approved' ? 'claimed' : 'pending',
            claimedBy: b.claimed_by || undefined,
            claimedAt: b.claimed_at
                ? new Date(b.claimed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                : undefined,
        }));
    }

    async createBooking(bookingData: CreateBookingData): Promise<void> {
        const { error } = await supabase
            .from('bookings')
            .insert([bookingData]);

        if (error) {
            throw new Error(error.message || 'Gagal menyimpan data booking');
        }
    }


    async claimBooking(bookingId: number, claimData: ClaimBookingData): Promise<void> {
        const { data, error } = await supabase
            .from('bookings')
            .update(claimData)
            .eq('id', bookingId)
            .eq('status', 'pending')
            .select();

        if (error) {
            throw new Error(error.message || 'Gagal mengklaim pengajuan survey');
        }

        if (!data || data.length === 0) {
            throw new Error('Pengajuan sudah diambil pengguna lain, tidak ditemukan, atau akses Anda ditolak.');
        }
    }

    async deleteBooking(bookingId: number): Promise<void> {
        const { data: deleted, error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', bookingId)
            .select('id');

        if (error) {
            throw new Error(error.message || 'Gagal menghapus pengajuan survey dari database');
        }

        // RLS yang menyaring baris tidak menghasilkan error, hanya 0 baris.
        if (!deleted || deleted.length === 0) {
            throw new Error('Pengajuan survey tidak terhapus: akses ditolak atau data tidak ditemukan.');
        }
    }
}
