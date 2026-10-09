# Use Case Specification
## Proyek: GSI One Mobile Application

---

## 1. Daftar Aktor

| Aktor | Deskripsi |
| --- | --- |
| **Klien / Customer GSI** | Pengguna yang mengakses aplikasi via Nomor Tiket / Email untuk memantau progres proyek, status SHMS, dan mengunduh berkas laporan inspeksi PDF. |
| **Field Engineer** | Insinyur lapangan GSI yang memperbarui status tahapan proyek, memasukkan catatan progres (`stage_updates`), dan mengunggah berkas foto inspeksi/laporan (`project_files`). |
| **Staf Marketing** | Staf yang memantau antrean permohonan survei (`bookings`), mengklaim permohonan, memproses persetujuan/penolakan, dan menginisiasi konversi permohonan menjadi proyek baru. |
| **System Administrator (Admin)** | Pengelola sistem dengan akses penuh untuk mendaftarkan akun baru via `AdminRegisterModal`, membuat proyek, dan mengelola kontrol operasional. |
| **Pengunjung Publik** | Pengguna umum yang mengeksplorasi katalog 6 layanan resmi GSI, studi kasus struktur, artikel insight, dan mengirimkan form permohonan survei. |

---

## 2. Spesifikasi Use Case Utama

### UC-01: Pendaftaran Akun Pengguna Terpusat (Admin-Only)
- **Aktor Utama**: System Administrator (Admin)
- **Pre-kondisi**: Admin sudah login dan membuka modal `AdminRegisterModal` pada Admin Dashboard.
- **Alur Utama**:
  1. Admin memasukkan Nama Lengkap, Email, Kata Sandi (minimal 8 karakter), dan memilih Role (`client`, `marketing`, `field_engineer`).
  2. Admin menekan tombol "Buat Akun".
  3. Sistem memvalidasi kelengkapan data input.
  4. Sistem memanggil `authStore.adminCreateUser()` yang berkomunikasi dengan Supabase Auth & tabel `profiles`.
  5. Sistem menampilkan notifikasi sukses dan menutup modal.
- **Post-kondisi**: Akun pengguna baru berhasil terdaftar di database Supabase dan siap digunakan untuk login.

### UC-02: Autentikasi Login (Nomor Tiket / Email & Password)
- **Aktor Utama**: Klien, Field Engineer, Marketing, Admin
- **Pre-kondisi**: Pengguna telah memiliki akun yang didaftarkan oleh Admin.
- **Alur Utama**:
  1. Pengguna memasukkan Nomor Tiket / Email dan kata sandi pada `LoginScreen`.
  2. Pengguna menekan tombol "Masuk Log".
  3. Sistem mengirim kredensial ke layanan autentikasi Supabase/REST yang dikonfigurasi.
  4. Server mengembalikan data sesi dan profil pengguna.
  5. Sistem menyimpan token dan data profil ke `AsyncStorage`.
  6. Pengguna diarahkan ke `AuthenticatedTabs` dengan tampilan Dashboard sesuai role.
- **Alur Alternatif**: Jika kredensial salah, sistem menggunakan `errorHelpers.ts` untuk menampilkan pesan kesalahan yang relevan.

### UC-03: Pengajuan Survei Lokasi (Book Survey)
- **Aktor Utama**: Pengunjung Publik / Klien
- **Pre-kondisi**: Pengguna berada di layar `BookSurveyScreen`.
- **Alur Utama**:
  1. Pengguna mengisi form: Nama Lengkap, Perusahaan, Email, Telepon, Jenis Layanan, Lokasi, Perkiraan Tanggal, Informasi Struktur, dan Catatan.
  2. Pengguna menekan tombol "Kirim Booking".
  3. Sistem memvalidasi kolom wajib.
  4. Sistem menyimpan entri baru ke tabel `bookings` (status `pending`).
  5. Pengguna diarahkan ke `SuccessScreen` dengan menyajikan rangkuman pengajuan.

### UC-04: Klaim & Persetujuan Permohonan Survei (Survey Request Pipeline)
- **Aktor Utama**: Staf Marketing, Admin
- **Pre-kondisi**: Staf login dan membuka `SurveyRequestsScreen`.
- **Alur Utama**:
  1. Staf melihat daftar permohonan survei berstatus `pending`.
  2. Staf menekan tombol "Klaim Permohonan" untuk mengikat permohonan ke ID akun staf (`status: claimed`).
  3. Staf menghubungi calon klien untuk verifikasi kebutuhan.
  4. Staf memilih "Setujui" (`status: approved`) atau "Tolak" (`status: rejected` dengan alasan).
- **Post-kondisi**: Permohonan survei berstatus `approved` siap dikonversi menjadi proyek baru.

### UC-05: Konversi Permohonan Survei & Pembuatan Proyek Baru
- **Aktor Utama**: Admin, Staf Marketing
- **Pre-kondisi**: Permohonan survei berstatus `approved`.
- **Alur Utama**:
  1. Staf menekan tombol "Konversi ke Proyek" pada permohonan survei yang disetujui.
  2. Sistem membuka `CreateProjectScreen` dengan parameter nama klien, layanan, dan lokasi terisi otomatis.
  3. Staf memilih Klien terdaftar, Tanggal Mulai/Selesai, dan memasukkan Field Engineer penanggung jawab.
  4. Staf menekan tombol "Buat Proyek".
  5. Sistem memanggil `projectService.createProject()` yang secara otomatis membuat record di `projects` beserta 4 tahapan di `project_stages`.

### UC-06: Pembaruan Linimasa Tahapan & Log Harian Lapangan
- **Aktor Utama**: Field Engineer, Admin
- **Pre-kondisi**: Engineer login dan membuka `ProjectDetailScreen` proyek yang ditugaskan.
- **Alur Utama**:
  1. Engineer memilih tahapan proyek yang berjalan (misal: Survei Lapangan).
  2. Engineer memperbarui status tahapan (`in_progress` / `done`) dan memasukkan persentase kemajuan total.
  3. Engineer menekan "Tambah Log Harian", memasukkan aktivitas harian dan catatan kendala.
  4. Sistem menyimpan entri ke `stage_updates` dan ter-sync secara realtime per proyek.

### UC-07: Pengunggahan & Unduh Dokumen Inspection / PDF Laporan
- **Aktor Utama**: Field Engineer, Admin (Pengunggah), Klien (Pengunduh)
- **Pre-kondisi**: Berada di `ProjectDetailScreen`.
- **Alur Utama**:
  1. Field Engineer menekan "Unggah Berkas", memilih foto inspeksi atau dokumen laporan PDF.
  2. Sistem mengunggah file ke bucket Supabase Storage `projects` privat dan menginsert metadata ke `project_files`.
  3. Klien membuka `ClientDashboard` atau `ProjectDetailScreen`, melihat daftar dokumen laporan, dan menekan tombol "Unduh PDF".
