# Panduan Administrator (Administrator Guide)
## Proyek: GSI One Mobile Application

---

## 1. Peran & Hak Akses System Administrator

System Administrator (Admin) memegang kontrol penuh operasional aplikasi GSI One Mobile, mencakup pendaftaran akun terpusat, pengelolaan proyek, persetujuan survei, dan monitoring sistem.

---

## 2. Prosedur Pendaftaran Akun Pengguna Baru (`AdminRegisterModal`)

> [!IMPORTANT]
> Registrasi mandiri publik telah ditiadakan demi menjaga kerahasiaan dan keamanan data proyek GSI. Semua akun (Klien, Engineer, Marketing) wajib dibuatkan oleh Admin.

Langkah Pendaftaran Akun:
1. Login ke aplikasi menggunakan akun Admin.
2. Pada **Admin Dashboard**, tekan tombol **Buat Akun Baru**.
3. Modal `AdminRegisterModal` akan terbuka.
4. Isi data:
   - Nama Lengkap
   - Email Resmi
   - Kata Sandi (Minimal 8 Karakter)
   - Role Pengguna (`client`, `marketing`, `field_engineer`)
5. Tekan **Buat Akun**.
6. Sistem akan memproses via Supabase Auth & membuat profil di tabel `profiles`. Terbitkan kredensial tersebut kepada pengguna terkait.

---

## 3. Pembuatan & Pengelolaan Proyek Baru

1. Pada Admin Dashboard, tekan **Buat Proyek Baru**.
2. Form `CreateProjectScreen` akan tampil.
3. Masukkan Kode Proyek, Nama Proyek, Klien Pemilik, Jenis Layanan, Lokasi, Tanggal Mulai/Selesai, dan tentukan Field Engineer Penanggung Jawab.
4. Tekan **Simpan Proyek**. Sistem secara otomatis menggenerasi 4 tahapan standar proyek (`project_stages`).

---

## 4. Pemeliharaan Otorisasi & Sinkronisasi Nama User (Migrasi & Trigger SQL)

1. **Jalankan Skrip Migrasi `backend/fix_project_client_ids.sql`**:
   - Memastikan seluruh data proyek Klien terhubung dengan kolom UUID `client_id`.
2. **Jalankan Skrip RLS & Trigger `backend/update_rls_policies.sql`**:
   - Mengaktifkan aturan RLS berbasis UUID `client_id = auth.uid()` dan memasang PostgreSQL Trigger `sync_user_name_changes` agar pengubahan nama profil pengguna secara otomatis mensinkronkan `projects.client_name` tanpa merusak otorisasi proyek.

---

## 5. Tabel Hak Akses System Administrator

| Operasi | Admin | Non-Admin |
| --- | --- | --- |
| Membuat akun pengguna baru (Client, Marketing, Engineer) | Ya | Tidak |
| Menghapus akun pengguna | Ya (via Supabase Dashboard) | Tidak |
| Membuat proyek baru | Ya | Tidak |
| Menghapus proyek | Ya | Tidak |
| Mengedit metadata semua proyek | Ya | Terbatas (hanya proyek sendiri) |
| Melihat semua proyek tanpa filter | Ya | Tidak |
| Menyetujui / menolak booking survei | Ya | Marketing saja |
| Menjalankan migrasi SQL database | Ya | Tidak |
| Mengakses Supabase Dashboard | Ya | Tidak |
| Melihat log audit CORS | Ya (via server console) | Tidak |

---

## 6. Tabel Konfigurasi Environment Wajib (Checklist Admin)

| File | Variabel | Deskripsi | Wajib | Default |
| --- | --- | --- | --- | --- |
| `backend/.env` | `JWT_SECRET` | Secret key untuk signing JWT token | Ya (Fatal jika kosong) | - |
| `backend/.env` | `PORT` | Port server Express | Tidak | `3000` |
| `backend/.env` | `SUPABASE_URL` | URL proyek Supabase Cloud | Tidak (jika pakai SQLite saja) | - |
| `backend/.env` | `SUPABASE_SECRET_KEY` | Service Role Key Supabase | Tidak (jika pakai SQLite saja) | - |
| `.env` (root) | `SUPABASE_URL` | URL proyek Supabase Cloud untuk frontend | Ya | - |
| `.env` (root) | `SUPABASE_ANON_KEY` | Anon/Public API Key Supabase | Ya | - |
| `.env` (root) | `APP_ENV` | Environment flag | Tidak | `development` |
| `.env` (root) | `API_BASE_URL_EMULATOR` | Base URL backend untuk Android emulator | Tidak | `http://10.0.2.2:3000` |
| `.env` (root) | `API_BASE_URL_PRODUCTION` | Base URL backend produksi | Ya (untuk build release) | - |

---

## 7. Tabel Skrip SQL Administrasi Database

| File Skrip | Fungsi | Kapan Dijalankan |
| --- | --- | --- |
| `backend/supabase_schema.sql` | Membuat 7 tabel utama, indeks, dan trigger | Setup awal Supabase |
| `backend/update_rls_policies.sql` | Mengaktifkan RLS policies & trigger sync nama | Setelah setup skema |
| `backend/fix_project_client_ids.sql` | Migrasi kolom `client_id` pada proyek lama | Sekali saat migrasi v2.0 |
| `backend/fix_booking_notifications.sql` | Perbaikan notifikasi booking | Sekali saat migrasi |
| `backend/setup_storage_bucket.sql` | Konfigurasi bucket Storage `projects` privat | Setup awal Supabase |
| `backend/verify_rls.sql` | Verifikasi status RLS aktif di semua tabel | Audit berkala |
| `backend/add_delete_policies.sql` | Menambahkan policy DELETE untuk Admin | Sekali saat migrasi |


