# Test Cases Specification

## Pengujian otomatis yang tersedia

Suite berada di `__tests__/`: domain ProjectEntity, SurveyRequestEntity, UserRole; helper format, error, tiket, user, dan proyek; service notifikasi, signed URL, mapper, pagination, filter query per role; alur repository/notifikasi dengan mock; serta render App.

Jalankan `npm run test:ci`. Test Supabase memakai mock; hasilnya tidak membuktikan RLS atau layanan cloud bekerja.

## Skenario manual

| Area | Pemeriksaan |
| --- | --- |
| Auth | Login email/tiket, password salah, logout, pemulihan sesi |
| Admin | Pembuatan akun client/marketing/engineer melalui `admin-create-user`; non-admin ditolak |
| Booking | Validasi form publik, penyimpanan pending, klaim dan nama pengambil, penghapusan oleh admin |
| Proyek | Pembuatan dengan klien dan staf terdaftar, edit, hapus, filter daftar |
| Tahapan | Tambah/edit/hapus, ubah status, catatan progres, perhitungan status proyek |
| Berkas | Pilih foto/dokumen, upload Storage, pencatatan metadata, buka URL |
| Realtime | Dua perangkat pada proyek yang sama menerima perubahan tahapan/catatan |
| Notifikasi | Trigger booking, baca, tandai dibaca, hapus, rollback saat mutasi gagal |
| RLS | Isolasi antar-klien dan evaluasi akses staf langsung melalui Supabase |

Pembuatan proyek tidak menambahkan tahapan otomatis; tahapan dibuat pada detail proyek. Kemajuan keseluruhan dihitung dari proporsi tahapan selesai.
