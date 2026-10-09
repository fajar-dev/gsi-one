# Codebase Map - GSI One

Berkas ini menyediakan peta arsitektur dan panduan navigasi struktur folder serta file untuk mempermudah onboarding developer berikutnya pada proyek GSI One.

---

## Ikhtisar Arsitektur

Aplikasi GSI One menganut pola **Clean Architecture & Layered Domain Design (OOP)**:

1. **Frontend (React Native & TypeScript)**:
   - **Domain Layer (`src/domain/`)**: Entitas OOP bisnis (`ProjectEntity.ts`, `SurveyRequestEntity.ts`) dan Value Objects/Enums (`ProjectStatus.ts`, `UserRole.ts`).
   - **Repository Pattern (`src/services/repositories/`)**: `SupabaseProjectRepository.ts` adalah façade atas sub-repository query, stage, file, dan command; `projectMapper.ts` memetakan DTO database secara eksplisit. `storageService.ts` menangani signed URL bucket privat dan `notificationService.ts` menangani notifikasi berhalaman.
   - **Custom Hooks (`src/hooks/`)**: State isolation hooks (`useSurveyRequests`, `useProjectDetail`, `useEditProjectForm`, `useStructureDetail`, `useProfile`, `useProjectRealtime`, `useAuth`).
   - **State Management**: Zustand Stores (`authStore.ts`, `projectStore.ts`).
   - **UI Component Layer (`src/screens/` & `src/components/`)**: Visual rendering presentation layer yang sepenuhnya *decoupled* dari logika bisnis backend.

2. **Backend (Node.js/Express & Supabase)**:
   - Berada di dalam direktori `backend/`, dengan `server.js` sebagai entry point yang mendaftarkan router `authRoutes`, `projectRoutes`, `bookingRoutes`, `fileRoutes`, dan `notificationRoutes`. Konfigurasi, middleware auth, dan helper status proyek berada di modul terpisah.
   - Dilengkapi fitur keamanan CORS (`allowedOrigins`), rate limiting (`authLimiter`), penanganan upload Multer, dan pemrosesan kredensial terenkripsi (bcryptjs & JWT).

---

## Modul Theme & Design Tokens (`assets/` & `src/theme/`)

- **`assets/styles/Colors.tsx`**: Modul pusat Design Tokens yang mendefinisikan:
  - `roleColors`: Warna tema per role (`admin`, `marketing`, `engineer`, `client`) — semua role saat ini berbagi palet teal/hijau yang seragam (`#002239` → `#0F9F67`).
  - `neutral`: Skala warna netral dari `neutral[50]` hingga `neutral[900]` (berbasis Material Design).
  - `surface`: Token latar belakang (`surface.primary`, `surface.secondary`, `surface.screen`, `surface.card`).
  - `overlay`: Token semi-transparan (`overlay.white20`, `overlay.white85`, `overlay.black06`, dll.).
  - `colors`: Palet warna legasi logo GSI One (dipertahankan untuk kompatibilitas ke belakang).
- **`assets/styles/GlobalStyle.tsx`**: Objek `Gs` berupa `StyleSheet` utilitas komposisi — tipografi (`Gs.h1`–`Gs.h5`), layout (`Gs.flexRow`, `Gs.itemsCenter`), dan corner radius asimetris (`Gs.cornerXS`–`Gs.cornerXL`, tiga sudut saja).
- **`src/theme/roleTheme.ts`**:
  - `useRoleTheme()`: Hook React yang secara otomatis mendeteksi role pengguna aktif dan mengembalikan `gradient`, `accent`, `accentLight`, dan bendera boolean per-role (`isAdmin`, `isMarketing`, `isEngineer`, `isClient`, `isInternal`).
  - `getRoleTheme(role)`: Helper murni untuk resolusi tema di luar komponen React (utility/navigasi).

---

## Direktori Frontend (`src/`)

### 1. `domain/` (OOP Entities & Value Objects)
- **`ProjectEntity.ts`**: Kelas Entitas OOP Proyek (`getProgressPercentage()`, `isOverdue()`, `getFormattedBudget()`).
- **`SurveyRequestEntity.ts`**: Kelas Entitas OOP Booking Survey (`claimBy()`, `getWhatsAppUrl()`).
- **`ProjectStatus.ts`**: Value Object & Enum status proyek (`on_progress`, `pending`, `completed`, `delayed`).
- **`UserRole.ts`**: Value Object & Enum per-role (`admin`, `marketing`, `engineer`, `client`).

### 2. `services/` (Services & Repositories)
- **`repositories/IProjectRepository.ts`**: Interface kontrak dasar pengaksesan data proyek.
- **`repositories/SupabaseProjectRepository.ts`**: Façade implementasi proyek; mendelegasikan query, stage, file, dan command ke `repositories/sub/`.
- **`mappers/projectMapper.ts`**: Pemetaan eksplisit row Supabase ke model proyek.
- **`storageService.ts`**: Generator signed URL untuk file di bucket `projects` privat.
- **`notificationService.ts`**: Query notifikasi dengan filter server-side, pagination, dan mutasi yang mendeteksi penolakan RLS.
- **`projectService.ts`**: Facade pembungkus (backward compatible).
- **`authService.ts`**: Layanan otentikasi login, register, dan admin user creation.

### 3. `hooks/` (Custom React Hooks)
- **`useSurveyRequests.ts`**: Hook pengelola pengajuan survey & claim status.
- **`useProjectDetail.ts`**: Hook pengelola detail proyek, timeline tahapan, dan updates.
- **`useEditProjectForm.ts`**: Hook pengelola modal edit proyek.
- **`useStructureDetail.ts`**: Hook pengelola detail bangunan/struktur.
- **`useProfile.ts`**: Hook pengelola profil user & pengubahan preferensi.
- **`useProjectRealtime.ts`**: Subscription listener WebSocket Supabase.
- **`useRoleTheme.ts`**: Resolusi tema dinamis berbasis role pengguna.
- **`useAuth.ts`**: Hook pengakses `authStore`.

### 4. `utils/` (Helper Utilities)
- **`userHelpers.ts`**: Fungsi `getUserInitials()` murni untuk inisial nama avatar user.
- **`projectHelpers.ts`**: Utility helper proyek (`getProjectImage`, `getProjectLocation`, `getProjectDuration`, `getBridgeStats`, `getProgressSubtext`).
- **`responsive.ts`**: Scaling responsif berbasis lebar referensi 390px — `scale(n)`, `fontScale(n)` (max 130%), `wp(pct)`, `hp(pct)`, serta konstanta `SCREEN_WIDTH` dan `SCREEN_HEIGHT`.
- **`errorHelpers.ts`**: Helper terpusat `getErrorMessage(error, fallback)` untuk normalisasi error di setiap catch block.
- **`formatters.ts`**: Helper terpusat `formatDateDisplay(date)`, `formatDateDb(date)`, `formatCurrency(val)` untuk konsistensi pemformatan.

### 5. `store/` (State Management Zustand)
- **`authStore.ts`**: State global otentikasi, pendaftaran, pemulihan kata sandi, dan penyimpanan cache profil di AsyncStorage.
- **`projectStore.ts`**: State global daftar proyek, tahapan, log catatan, upload berkas, serta selector granular agar komponen tidak berlangganan seluruh store.
- **`notificationStore.ts`**: State notifikasi dengan optimistic update dan rollback saat mutasi ditolak/gagal.

### 6. `components/` (Komponen Reusable)
- **`common/ScreenHeader.tsx`**: Shared gradient header yang auto-resolve warna gradient dari `useRoleTheme()`. Mendukung props `title`, `subtitle`, `showBackButton`, `rightAction`, dan `gradientColors` override. Menggunakan `useSafeAreaInsets()` untuk safe area otomatis.
- **`common/Header.tsx`**: Header non-gradient untuk layar publik — menampilkan logo, nama perusahaan, dan border line dekoratif.
- **`common/SupportCard.tsx`**: Card reusable "Dukungan & Bantuan" yang menampilkan nomor telepon (tap-to-call) dan situs web resmi. Digunakan oleh Admin, Engineer, dan Profile screen.
- **`common/SkeletonBox.tsx`**: Komponen placeholder loading atomic berbasis animated opacity.
- **`BottomNav/index.tsx`**: Komponen navigasi bawah publik.
- **`ErrorBoundary/`**: Komponen pengaman aplikasi dari error fatal render tree.

---

## Pemetaan Modul Halaman (`src/screens/`)

### 1. `Dashboard/` (Dashboard Akun Per-Role)
- **`index.tsx`**: Router sederhana yang mengarahkan ke tampilan per-role berdasarkan `user?.role`.
- **`AdminDashboard.tsx`**: Tampilan Administrator (pendaftaran user baru, kontrol sistem).
- **`MarketingDashboard.tsx`**: Tampilan Marketing (daftar reservasi survey & claim status).
- **`EngineerDashboard.tsx`**: Tampilan Field Engineer (update progres & upload berkas teknis).
- **`ClientDashboard.tsx`**: Tampilan Klien (monitoring jembatan/gedung & timeline progres).
- **`components/DashboardHeader.tsx`**: Header gradient shared dengan background image sync.
- **`components/QuickAccessGrid.tsx`**: Grid tombol akses cepat per-role.
- **`components/ProjectSummary.tsx`**: Ringkasan statistik & Donut Chart SVG.
- **`components/RecentProjects.tsx`**: Section preview daftar proyek terbaru.
- **`components/AdminRegisterModal.tsx`**: Modal pendaftaran akun pengguna baru oleh Admin.

### 2. `BookSurvey/` (Survey & Form Pemesanan)
- **`BookSurvey.tsx`**: Formulir pemesanan survey struktur bangunan.
- **`SuccessScreen.tsx`**: Tampilan notifikasi pengajuan survey berhasil.
- **`SurveyRequestsScreen.tsx`**: Halaman "Daftar Survey" (Marketing & Admin view).

### 3. `Projects/` (Manajemen Proyek & Detail)
- **`ProjectListScreen.tsx`**: Daftar proyek dengan pencarian, filter status, dan infinite scroll pagination.
- **`ProjectDetailScreen.tsx`**: Linimasa tahapan detail proyek, progress bar, log catatan, serta dokumen teknis.
- **`CreateProjectScreen.tsx`**: Halaman pendaftaran proyek baru (Admin-only).
- **`EditProjectModal.tsx`**: Modal pengeditan detail proyek.
- **`components/`**:
  - `StatusUpdateModal.tsx`: Modal pembaruan status tahapan.
  - `AddNoteModal.tsx`: Modal penambahan catatan progres harian.
  - `UploadFileModal.tsx`: Modal pengunggahan berkas teknis.
  - `CreateStageModal.tsx`: Modal pembuatan tahapan baru.
  - `StageTimeline.tsx`: Penampil tahapan garis vertikal.
  - `StatusBadge.tsx`: Badge status proyek/tahapan.

### 4. `Services/` (Katalog Layanan Publik)
- **`LayananKamiScreen.tsx`**: Halaman utama katalog 6 layanan resmi PT Graha Survei Indonesia (GSI).
- **`LayananDetailScreen.tsx`**: Layar detail interaktif kaya informasi untuk tiap layanan (Deskripsi, Kapan Membutuhkan/Cocok Untuk, Risiko/Permasalahan, Solusi GSI, Manfaat, Output Client, & Gambar Detail).
- **`ServiceDetailTemplate.tsx`**: Template reusable untuk halaman detail layanan pendukung.
- **`ServiceNDT.tsx`, `ServiceSHMS.tsx`, `ServiceUnderwater.tsx`, `ServiceLoadingTest.tsx`**: Halaman detail spesifik yang dikonsolidasikan menggunakan `ServiceDetailTemplate`.

### 5. `data/` (Katalog & Static Data)
- **`layanan.ts`**: Data terstruktur 6 katalog layanan utama GSI (Forensic Engineering, Risk Asset Integrity, Repair & Strengthening, Natural Hazard, SHMS, EEWS) beserta gambar banner & detail.
- **`services.ts`**: Data kategori struktur & asesmen untuk section *Our Experience*.

### 5. `Structures/` (Studi Kasus & Detail Struktur)
- **`StructureDetail.tsx`**: Halaman detail struktur gedung/jembatan dengan `useStructureDetail`.
- **`components/StructureCarousel.tsx`**: Komponen komparasi slider/carousel gambar struktur.

### 6. `Login/` & `Profile/`
- **`Login/index.tsx`**, **`RegisterScreen.tsx`**, **`ForgotPasswordScreen.tsx`**: Layar autentikasi.
- **`Profile/index.tsx`**: Halaman profil pengguna dengan `useProfile`.

---

## Panduan Perintah Pengembangan & Verifikasi

```bash
# Menjalankan Backend Express API Server
cd backend && npm run dev

# Menjalankan Mobile App (Android)
npm run android

# Pengecekan Type Safety TypeScript (0 error)
npx tsc --noEmit

# Pengecekan ESLint (0 error)
npm run lint

# Kompilasi Dokumentasi HTML Interactive
cd docs && node generate_docs.js

# Menjalankan quality gate yang juga dijalankan CI
npm run lint
npm run typecheck
npm run test:ci
```
