# Software Design Document (SDD)
## Proyek: GSI One Mobile Application
## Standar: IEEE 1016 (adaptasi)

---

## 1. Desain Modul Autentikasi & Akun

### 1.1 Layar Login (`src/screens/Login/index.tsx`)
- Menampilkan form input Nomor Tiket / Email dan Kata Sandi.
- Memanggil `useAuthStore().login(ticketOrEmail, password)` saat tombol Login ditekan.
- Menggunakan `errorHelpers.ts` untuk pengolahan pesan kesalahan yang informatif.
- Mengalihkan pengguna ke Authenticated Area (`AuthenticatedTabs`) setelah login berhasil.

### 1.2 Modal Pendaftaran Akun Admin (`src/screens/Dashboard/components/AdminRegisterModal.tsx`)
- Digunakan khusus oleh System Administrator untuk mendaftarkan akun baru (Klien, Marketing, Engineer).
- Menampilkan form input Nama Lengkap, Email, Kata Sandi (min 8 karakter), dan Pilihan Role (`client`, `marketing`, `engineer`).
- Memanggil `useAuthStore().adminCreateUser(name, email, password, role)`.

### 1.3 `authStore.ts` & Layanan Autentikasi
- State: `{ user, token, isLoading, isInitialized, error }`.
- Actions: `initialize()`, `login()`, `adminCreateUser()`, `logout()`, `clearError()`.
- Persistensi sesi tersimpan otomatis di `AsyncStorage`.

---

## 2. Desain Modul Layanan Publik & Book Survey

### 2.1 Katalog Layanan & Detail (`src/screens/Services/`)
- `LayananKamiScreen.tsx`: Menampilkan grid/katalog 6 layanan resmi GSI (Structural Forensic, Risk Asset Integrity, Structural Repair Design, Natural Hazard Risk Assessment, SHMS, EEWS).
- `LayananDetailScreen.tsx`: Menampilkan detail layanan, kartu peringatan risiko, solusi GSI, output client, dan CTA "Pesan Survei".
- `Services/index.tsx`: Katalog studi kasus asesmen per kategori struktur (Gedung, Jembatan, Dermaga/Jetty, Industri).
- `StructureDetailScreen.tsx`: Informasi asesmen struktur spesifik & simulasi stream telemetri sensor SHMS.

### 2.2 Form Pengajuan Survei (`src/screens/BookSurvey/index.tsx`)
- Menggunakan `useSurveyRequests()` hook dan `surveyService.ts`.
- Validasi input form: Nama, Perusahaan, Email, Telepon, Jenis Layanan, Lokasi, Perkiraan Tanggal, Deskripsi.
- Mengirimkan record ke tabel Supabase `bookings` melalui `SupabaseSurveyRepository.ts`.
- Navigasi ke `SuccessScreen.tsx` setelah permohonan berhasil dikirim.

### 2.3 Manajemen Permohonan Survei (`src/screens/BookSurvey/SurveyRequestsScreen.tsx`)
- Digunakan oleh Staf Marketing dan Admin.
- Menampilkan antrean permohonan survei (`pending`, `claimed`, `approved`, `rejected`).
- Fitur Klaim Permohonan (`claimSurveyRequest`), Persetujuan/Penolakan (`approveSurveyRequest`, `rejectSurveyRequest`).
- Tombol aksi "Konversi ke Proyek" yang mengarahkan ke `CreateProjectScreen` dengan parameter terisi otomatis.

---

## 3. Desain Modul Manajemen Proyek & Tracking

### 3.1 Layar Daftar Proyek (`src/screens/Projects/ProjectListScreen.tsx`)
- Menampilkan daftar proyek dengan pencarian, filter status (`in_progress`, `completed`, `draft`), dan penyaringan berbasis role (Klien hanya melihat proyeknya, Engineer melihat proyek ditugaskan, Admin/Marketing melihat semua).
- Menggunakan `useProjects()` hook.

### 3.2 Layar Detail Proyek (`src/screens/Projects/ProjectDetailScreen.tsx`)
- Menggunakan `useProjectDetail(projectId)` hook.
- Menampilkan linimasa proyek (`StageTimeline.tsx`), persentase kemajuan total, catatan progres (`stage_updates`), dan dokumen inspection/laporan PDF (`project_files`).
- Komponen Modal: `AddLogModal.tsx` (tambah log harian) dan `UploadFileModal.tsx` (unggah foto/berkas ke Supabase Storage).

### 3.3 Pembuatan Proyek (`src/screens/Projects/CreateProjectScreen.tsx`)
- Menggunakan `useCreateProjectForm()` hook.
- Form pengisian data proyek baru, penentuan klien, tanggal, jenis layanan, dan penugasan insinyur lapangan.
- Memanggil `projectService.createProject()` yang secara otomatis membuat entitas proyek dan 4 tahapan default (`project_stages`).

---

## 4. Desain Modul Multi-Role Dashboard

### 4.1 Route Guard & Dynamic Dashboard Router (`src/screens/Dashboard/index.tsx`)
- Membaca `user.role` dari `useAuthStore()`.
- Merender komponen dashboard khusus sesuai peran pengguna:
  - `AdminDashboard.tsx`: Ringkasan statistik sistem, manajemen user, antrean survei, proyek aktif.
  - `MarketingDashboard.tsx`: Pipeline permohonan survei, status klaim, dan konversi proyek.
  - `EngineerDashboard.tsx`: Proyek yang ditugaskan, update linimasa berjalan, input log harian cepat.
  - `ClientDashboard.tsx`: Progres proyek klien, status kesehatan struktur SHMS, dan laporan inspeksi.
