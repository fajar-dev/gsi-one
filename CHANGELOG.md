# Catatan Perubahan (Changelog) - GSI One Mobile

Semua perubahan dan pembaruan pada proyek GSI One Mobile dicatat di berkas ini.

## [1.4.0] - 2026-07-30

### Keamanan, Skalabilitas, dan Kualitas Rilis
- **RLS dan akses data**: Menutup pembuatan notifikasi langsung dari klien, menerapkan policy penerima/pemilik untuk baca, ubah, dan hapus notifikasi, serta mengganti ketergantungan policy proyek pada `client_name` menjadi UUID relasional (`client_id`/`created_by`).
- **Database dan realtime**: Menambahkan indeks untuk query proyek, tahapan, pembaruan, berkas, dan notifikasi; `stage_updates.project_id` kini dibackfill dan disinkronkan oleh trigger agar channel realtime dapat difilter per proyek. Urutan stage juga dilindungi constraint unik `(project_id, sequence)`.
- **Pagination dan storage privat**: List proyek/notifikasi memakai pagination offset-limit; bucket `projects` menjadi privat dengan policy baca/unggah berbasis akses proyek dan layanan `storageService.getSignedUrl()` untuk URL sementara.
- **Refactor modul**: `backend/server.js` menjadi entry point yang mendaftarkan route modular. Repository proyek kini façade atas sub-repository query, stage, file, dan command, memakai mapper DTO eksplisit. Selector Zustand ditambahkan untuk state proyek dan notifikasi.
- **Operasi dan quality gate**: Menambahkan migrasi retention notifikasi, logger terstruktur, benchmark lokal, baseline SLO, ADR, test integration, serta workflow GitHub Actions untuk lint, typecheck, dan test.

## [1.3.4] - 2026-07-30

### Perbaikan Bug Akses Proyek Saat Nama User (Client, Marketing, Engineer) Diubah
- **Otorisasi & Access Control berbasis UUID `client_id` (`backend/server.js`, `backend/update_rls_policies.sql`)**:
  - Memperbarui RLS SELECT policy pada Supabase PostgreSQL (`projects`, `project_stages`, `stage_updates`, `project_files`) agar menyertakan kueri `client_id = auth.uid()`.
  - Memperbarui kueri backend Express (`GET /api/projects` dan `GET /api/projects/:id`) untuk memeriksa `client_id` (UUID) di samping pencocokan string nama.
- **Trigger PostgreSQL Sinkronisasi Nama Pengguna (`update_rls_policies.sql`)**:
  - Menambahkan PostgreSQL Trigger `sync_user_name_changes` pada tabel `public.users` yang secara otomatis mensinkronkan `projects.client_name = NEW.name` setiap kali nama pengguna diperbarui.
- **Skrip Migrasi Data Proyek (`fix_project_client_ids.sql`)**:
  - Mengisi `client_id` pada proyek-proyek lama yang bernilai `NULL` serta mensinkronkan `client_name` dengan nama user terbaru.
- **Pembaruan Modal Profile & Repository (`EditProfileModal.tsx`, `SupabaseProjectRepository.ts`)**:
  - Memperbarui `EditProfileModal.tsx` untuk mensinkronkan `client_name` secara eksplisit saat Client mengubah nama profil.
  - Memperbarui `SupabaseProjectRepository.ts` dengan penanganan filter kueri eksplisit untuk peran `engineer` (`engineer_id.eq.${userId} OR created_by.eq.${userId}`).

---

## [1.3.3] - 2026-07-29

### Perbaikan Bug Proyek Marketing, Storage Bucket, & Status Survei
- **Akses Proyek Marketing (`SupabaseProjectRepository.ts`)**:
  - Memperbarui kueri `getProjects` untuk role `marketing` sehingga menyaring proyek berdasarkan `marketing_id = userId OR created_by = userId`.
  - Proyek yang dibuat oleh Admin dan di-assign ke staf Marketing kini dapat muncul pada daftar proyek akun Marketing terkait.
- **Penyelesaian Error Supabase Storage Bucket (`uploadFile` & `setup_storage_bucket.sql`)**:
  - Memperbarui pembentukan `storagePath` pada `uploadFile` dari `projects/${projectId}/${cleanFileName}` menjadi `${projectId}/${cleanFileName}` untuk menghindari duplikasi nama bucket pada public URL.
  - Menyediakan skrip SQL `backend/setup_storage_bucket.sql` untuk menginisialisasi storage bucket `projects` dengan properti `public = true` dan aturan RLS terkonfigurasi secara aman.
- **Keterangan Survei Dihubungi Marketing (`SurveyRequestsScreen.tsx` & `useSurveyRequests.ts`)**:
  - Menambahkan kolom `claimed_by` (VARCHAR) dan `claimed_at` (TIMESTAMP WITH TIME ZONE) pada tabel `public.bookings` (via `backend/update_bookings_schema.sql` dan `backend/supabase_schema.sql`).
  - Memperbarui penanganan klaim survei di `useSurveyRequests.ts` untuk menyimpan nama staf Marketing (misal `Ahmad (Marketing)`).
  - Memperbarui tampilan kartu survei di `SurveyRequestsScreen.tsx` dengan badge `Sudah Dihubungi` dan keterangan khusus `Sudah dihubungi oleh: [Nama Staf Marketing] ([Tanggal/Waktu])` yang terlihat jelas baik oleh role Admin maupun Marketing.

---

## [1.3.2] - 2026-07-28

### Arsitektur Pengadaan Akun Terpusat & Supabase Edge Function
- **Supabase Edge Function (`admin-create-user`)**:
  - Dibuat Edge Function serverless pada `supabase/functions/admin-create-user/index.ts` untuk memproses registrasi pengguna seluruh role (`client`, `marketing`, `engineer`, `admin`) secara aman menggunakan `SUPABASE_SERVICE_ROLE_KEY`.
- **Model Pengadaan Akun Terpusat (Centralized Account Provisioning)**:
  - Mengubah alur pendaftaran sehingga **seluruh akun pengguna (termasuk Klien)** didaftarkan secara eksklusif oleh System Administrator via modal `AdminRegisterModal`.
  - Pendaftaran mandiri publik pada `authService.register` dinonaktifkan total demi keamanan data perusahaan.
- **Pembaruan Modal Admin UI (`AdminRegisterModal.tsx`)**:
  - Menambahkan chip selector role `Admin` di samping `Klien`, `Marketing`, dan `Engineer` serta memperbarui validasi password minimal 8 karakter.
- **Pembaruan Dokumen Sistem & Panduan Administrator**:
  - Memperbarui `Administrator_Guide.md`, `SRS.md`, dan `API_SPECIFICATION.md` untuk mendokumentasikan model pengadaan akun terpusat dan endpoint Supabase Edge Function.

---

## [1.3.1] - 2026-07-28

### Security Hardening & Audit System (Prioritas P1, P2 & P3)
- **Privilege Escalation Protection (SEC-CRIT-01)**:
  - Memperbarui fungsi trigger PostgreSQL `handle_new_user()` pada `backend/supabase_schema.sql` dan `backend/update_rls_policies.sql` untuk selalu menetapkan role `'client'` pada pendaftaran mandiri Supabase Auth.
  - Mencabut total fallback registrasi client-side pada `authService.ts` untuk memastikan pendaftaran akun staf (`admin`, `marketing`, `engineer`) wajib melalui server Admin Express ter-otorisasi.
- **Pembersihan Secret Keys dari Mobile App (SEC-HIGH-01)**:
  - Menghapus `RESEND_API_KEY` dari berkas `.env` dan `.env.example` aplikasi mobile untuk mencegah ekstraksi API Key melalui dekompilasi APK/IPA.
- **Sanitasi PostgREST Filter Injection (SEC-HIGH-02)**:
  - Mengamankan kueri `.or()` di `SupabaseProjectRepository.ts` dengan penyanitasian karakter khusus PostgREST (seperti `,`, `()`, `%`) dan pematuhan sintaks kueri terisolasi.
- **Keystore & Security Storage Hardening (SEC-MED-01 & SEC-MED-02)**:
  - Memindahkan password debug keystore dari `android/app/build.gradle` ke `android/gradle.properties` (terpengabai Git).
  - Menambahkan sanitasi `sanitizeAuthUser` pada `authStore.ts` dan isolasi try-catch pada I/O `AsyncStorage`.
- **Penguatan Middleware Express Backend (SEC-MED-03)**:
  - Menambahkan `app.disable('x-powered-by')` di `backend/server.js` untuk menyembunyikan identitas framework backend, serta mengaktifkan audit logging pada filter CORS.
- **Git Tracking & SQLite Isolation (SEC-HIGH-03)**:
  - Menambahkan aturan pengabaian berkas database SQLite `*.db` dan `backend/*.db` pada `.gitignore`.

---

## [1.2.0] - 2026-07-27

### Pembaruan Katalog Layanan, Layar Detail & Visual Frontend
- **Redesain Katalog & Data Layanan Resmi GSI (`src/data/layanan.ts`)**:
  - Mengintegrasikan 6 katalog layanan teknis utama PT Graha Survei Indonesia (GSI) dari berkas materi resmi: Structural Forensic Engineering, Risk Asset Integrity & Reliability Assessment, Structural Repair & Strengthening Design, Natural Hazard Risk Assessment, Structural Health Monitoring System (SHMS), dan Earthquake Early Warning System (EEWS).
- **Layar Detail Layanan Terintergrasi (`LayananDetailScreen.tsx`)**:
  - Dibuat layar detail interaktif lengkap dengan banner hero, ilustrasi teknis, kartu peringatan risiko, kartu solusi GSI, checklist manfaat, output yang diterima client, serta tombol CTA jadwal survei.
- **Pemisahan Entitas Our Experience & Layanan Kami**:
  - Memisahkan secara tegas antara *Our Experience* (`ServicesScreen` - studi kasus asesmen per jenis struktur) dan *Layanan Kami* (`LayananKamiScreen` - 6 katalog layanan resmi GSI).
- **Update Insight Struktur & Keunggulan GSI (`InsightStruktur.tsx` & `WhyChooseGsi.tsx`)**:
  - Memperbarui daftar artikel edukasi struktur dan menambahkan 3 kartu alasan keunggulan GSI.
- **Aset Partner & Launch Icon App Android**:
  - Menambahkan logo partner perusahaan baru dan meng-update ikon aplikasi launcher Android dengan desain logo resmi GSI.

---

## [1.1.0] - 2026-07-22

### Pembaruan Dokumentasi Komprehensif & Codebase Sync
- **Katalog API & Database (`docs/api_catalog_documentation.md`)**:
  - Mengisi berkas dokumentasi katalog API & database yang sebelumnya kosong (0 byte) dengan skema Supabase PostgreSQL lengkap, RLS Security Policies, Auth SDK, Realtime WebSocket channel, Storage buckets, dan rincian REST API Express.
- **Spesifikasi REST API (`docs/API_SPECIFICATION.md`)**:
  - Menambahkan spesifikasi REST API endpoints Express backend yang belum terdaftar (`POST /api/admin/create-user`, `GET /api/users/role/:role`, `GET /api/dashboard/stats`, `POST /api/stages/:id/updates`).
  - Menambahkan rincian spesifikasi rate limiting (`authLimiter`), filter unggahan file Multer (`ALLOWED_MIME_TYPES`), CORS allowed origins, dan penanganan error jaringan.
- **Peta Codebase (`CODEBASE_MAP.md`)**:
  - Meng-update peta arsitektur proyek mencakup arsitektur Clean Architecture, Domain Entities OOP (`src/domain/`), Repository Pattern (`src/services/repositories/`), Custom Hooks (`src/hooks/`), Helper Utilities (`src/utils/`), Sub-Modals (`src/screens/Projects/components/`), dan Service Detail Template.
- **README Utama (`README.md`)**:
  - Memperbarui diagram pohon direktori proyek, daftar teknologi pendukung, instruksi verifikasi, dan tautan navigasi ke berkas dokumentasi teknis internal.
- **Kompilasi Interactive HTML Documentation (`docs/generate_docs.js`)**:
  - Merender seluruh berkas Markdown dokumentasi menjadi tampilan HTML visual interaktif (`docs/index.html` dan `docs/docs_data.js`).

---

### Major Codebase Maintainability & Architecture Refactoring (Tahap 1 - Tahap 5)

#### 1. Clean Architecture & Layered Domain Design (OOP)
- **Domain Layer (`src/domain/`)**:
  - Dibuat kelas Entitas Domain OOP `ProjectEntity.ts` dan `SurveyRequestEntity.ts` untuk merangkum metode bisnis (`getProgressPercentage()`, `isOverdue()`, `getFormattedBudget()`, `claimBy()`, `getWhatsAppUrl()`).
  - Dibuat Value Objects & Enums `ProjectStatus.ts` dan `UserRole.ts` untuk mengeliminasi *magic string* di seluruh aplikasi.

#### 2. Service Layer & Repository Pattern
- **Repository Pattern (`src/services/repositories/`)**:
  - Dibuat interface kontrak `IProjectRepository.ts` dan implementasi `SupabaseProjectRepository.ts` untuk mengisolasi kueri Supabase DB, Auth, Realtime, dan Storage.
  - `projectService.ts` diringkas menjadi Facade (100 baris, 100% backward compatible).

#### 3. Custom Hooks & UI-Logic Decoupling
- **State Management Isolation (`src/hooks/`)**:
  - Dibuat `useSurveyRequests.ts`, `useProjectDetail.ts`, `useEditProjectForm.ts`, `useStructureDetail.ts`, dan `useProfile.ts`.
  - Seluruh komponen UI murni bertanggung jawab untuk visual rendering (< 250 baris per file).

#### 4. Pemecahan File Raksasa & Template Layanan
- **Modularisasi Component (`src/screens/`)**:
  - `ProjectSubModals.tsx` (578 baris) dipecah menjadi 4 modal independen (`StatusUpdateModal`, `AddNoteModal`, `UploadFileModal`, `CreateStageModal`).
  - `ServiceDetailTemplate.tsx` dibuat untuk meringkas 4 halaman layanan (`ServiceNDT.tsx`, `ServiceSHMS.tsx`, `ServiceUnderwater.tsx`, `ServiceLoadingTest.tsx`) dari >1.500 baris menjadi <75 baris per file.
  - `StructureDetail.tsx` (738 baris) diringkas menjadi 250 baris (`useStructureDetail` & `StructureCarousel.tsx`).
  - `Profile/index.tsx` (570 baris) diringkas menjadi 250 baris (`useProfile` & `AdminRegisterUserModal.tsx`).

---

## [Unreleased] - 2026-07-21

### Fitur & Pengoptimalan Baru

#### 1. Performa & Progressive Data Loading (Opsi B)
- **Lazy & Progressive Loading pada Dashboard**:
  - `ClientDashboard.tsx`: Header dan Quick Access dimuat secara instan; detail proyek aktif di-fetch bertahap di latar belakang (`isLoadingDetail`).
  - `AdminDashboard.tsx`, `MarketingDashboard.tsx`, `EngineerDashboard.tsx`: Mengintegrasikan `useFocusEffect` dan `useCallback` untuk sinkronisasi data proyek di latar belakang tanpa menghalangi render tampilan utama.
- **Infinite Scroll Pagination pada List Proyek**:
  - `ProjectListScreen.tsx`: Mengimplementasikan pagination bertahap (`displayCount` per 10 item) dengan handler `onEndReached` serta parameter windowing `FlatList` (`initialNumToRender={10}`, `maxToRenderPerBatch={10}`, `windowSize={5}`) untuk mencegah lag UI pada daftar proyek yang panjang.

#### 2. Antarmuka (UI/UX) & Estetika Visual
- **Background Truck Image Sync**:
  - Mengaplikasikan background gambar truk (`assets/images/login-bg.jpg`) dari halaman Login ke header halaman Home (`src/screens/Home/header.tsx`) dan header Dashboard (`src/screens/Dashboard/components/DashboardHeader.tsx`).
  - Menambahkan overlay `LinearGradient` hijau-kehitaman (`rgba(1, 24, 27, 0.92)` -> `rgba(2, 115, 122, 0.82)`) untuk kontras teks yang optimal.
- **Consistency of Oval Header Shapes**:
  - Menyamakan bentuk sudut bawah header pada layar Login (`src/screens/Login/index.tsx`), Home, dan Dashboard menjadi bentuk oval/curved (`borderBottomLeftRadius: scale(28)` & `borderBottomRightRadius: scale(28)`).

#### 3. Perbaikan Bug & Aksesibilitas
- **Login Back Button Fix**:
  - Memperbaiki tombol kembali pada layar Login yang sebelumnya terhalang Status Bar.
  - Menggunakan `useSafeAreaInsets()` untuk kalkulasi posisi `top` yang adaptif pada semua perangkat.
  - Menambahkan `zIndex: 999`, `elevation: 10`, `hitSlop` 15px, serta lingkaran transparan `backgroundColor`.
  - Menambahkan fallback `navigation.reset({ index: 0, routes: [{ name: 'Home' }] })`.

---

## [1.0.0] - 2026-07-21
- Arsitektur awal aplikasi GSI One Mobile (Multi-role Dashboard, Project Tracking, Survey Booking, Autentikasi Supabase & Local Server).
