# Dokumen Handover Pengembang - GSI One Mobile Application

Dokumen ini disusun untuk memudahkan pengembang (programmer) baru atau tim pengembang penerus dalam memahami, menjalankan, mengembangkan, dan memelihara aplikasi **GSI One**.

---

## 1. Ikhtisar Proyek & Domain Bisnis

**GSI One** adalah aplikasi mobile resmi **PT Graha Survei Indonesia (GSI)** yang digunakan untuk pemantauan proyek survei struktur, inspeksi teknis, forensic engineering, dan Structural Health Monitoring System (SHMS).

### Peran Pengguna (4 User Roles)
Aplikasi menggunakan kontrol akses berbasis peran (Role-Based Access Control) yang menentukan tampilan dan hak akses fitur:

1. **System Administrator (`admin`)**:
   - Mendaftarkan akun pengguna baru (Marketing, Engineer, Client).
   - Membuat master proyek baru dan menetapkan Client & Engineer penanggung jawab.
   - Mengatur tahapan linimasa (timeline stages) proyek.

2. **Marketing & Business Development (`marketing`)**:
   - Mengelola pengajuan survey dari calon klien ("Daftar Survey").
   - Melakukan klaim status (claim request) survey untuk ditindaklanjuti.
   - Melihat portofolio layanan dan pengalaman proyek.

3. **Field Engineer (`engineer`)**:
   - Memperbarui progres tahapan proyek di lapangan.
   - Menambahkan catatan progres harian (daily progress logs).
   - Mengunggah berkas pengujian teknis (NDT, sertifikat, laporan).

4. **Client / Klien (`client`)**:
   - Memantau progres fisik dan status tahapan proyek jembatan/gedung secara real-time.
   - Membaca catatan log dari tim engineer.
   - Mengunduh dokumen dan laporan teknis proyek.

---

## 2. Arsitektur & Pola Desain (Architecture & Patterns)

Aplikasi dibangun menganut pola **Clean Architecture & Layered Domain Design (OOP)**:

```
[ UI Components (Screens & Components) ]
                   │
                   ▼
         [ Custom React Hooks ]
                   │
                   ▼
     [ Zustand Stores (Global State) ]
                   │
                   ▼
    [ Repository Layer (Façade & Sub-repos) ]
                   │
                   ▼
 [ Data Sources: Supabase SDK / Express API ]
```

### Lapisan Utama Codebase:
1. **Domain Layer (`src/domain/`)**:
   - Mengandalkan kelas OOP Domain Entity (`ProjectEntity.ts`, `SurveyRequestEntity.ts`) dan Value Objects (`ProjectStatus.ts`, `UserRole.ts`).
   - Menyediakan metode logika bisnis terisolasi (misal: `getProgressPercentage()`, `isOverdue()`, `getFormattedBudget()`).

2. **Repository Pattern (`src/services/repositories/`)**:
   - `SupabaseProjectRepository.ts` berlaku sebagai façade yang mendelegasikan kueri spesifik ke sub-repository (`sub/ProjectQueryRepository.ts`, `sub/ProjectStageRepository.ts`, `sub/ProjectFileRepository.ts`, `sub/ProjectCommandRepository.ts`).
   - Data Transfer Object (DTO) dari database dipetakan secara terpusat oleh `projectMapper.ts`.

3. **Custom Hooks Isolation (`src/hooks/`)**:
   - Memisahkan logika state UI dari komponen presentasi. Contoh: `useProjectDetail`, `useSurveyRequests`, `useProfile`, `useEditProjectForm`, `useProjectRealtime`.

4. **Design Token & Dynamic Theme (`assets/styles/` & `src/theme/`)**:
   - Sistem warna terpusat di `assets/styles/Colors.tsx`.
   - Resolusi tema warna dinamis per-role dikelola via `useRoleTheme()`.

---

## 3. Struktur Direktori Repository

Berikut peta navigasi direktori proyek:

```
d:\GSI One - Copy\
├── __tests__/               -- Automated Unit Test Suites (Jest)
├── assets/                  -- Image assets, icons, dan Design Tokens (Colors.tsx)
├── backend/                 -- Express REST API, SQLite DB, RLS SQL scripts
├── docs/                    -- Dokumentasi teknis lengkap & generator dokumen HTML
├── src/
│   ├── components/          -- Shared UI components (ScreenHeader, SupportCard, SkeletonBox, dll)
│   ├── config/              -- Supabase client config & API base URL
│   ├── domain/              -- OOP Domain Entities & Value Objects
│   ├── hooks/               -- React Custom Hooks
│   ├── navigation/          -- React Navigation (Auth Stack & Bottom Tabs)
│   ├── screens/             -- Tampilan Layar Utama (BookSurvey, Dashboard, Login, Profile, Projects, Services, Structures)
│   ├── services/            -- Service Layer & Sub-Repositories
│   ├── store/               -- State Management (authStore, projectStore, notificationStore)
│   ├── types/               -- Definitions & Database Types
│   └── utils/               -- Centralized helper functions (errorHelpers, formatters, responsive, projectHelpers)
├── App.tsx                  -- Entry Point Aplikasi Mobile
├── CODEBASE_MAP.md          -- Peta rinci per file dan modul
└── package.json             -- Manifes dependensi & npm scripts
```

---

## 4. Persiapan Lingkungan Pengembangan (Getting Started)

### Prasyarat Environment
- **Node.js**: `v20.x` atau lebih baru
- **Java Development Kit (JDK)**: OpenJDK 17
- **Android Studio & SDK**: Android SDK Platform 34 / API 35, Build Tools, NDK
- **React Native CLI**: `@react-native-community/cli`

### Langkah Pengoperasian Pertama

1. **Kloning / Navigasi ke Folder Proyek**:
   ```powershell
   cd "d:\GSI One - Copy"
   ```

2. **Instalasi Dependensi**:
   ```powershell
   npm install
   ```

3. **Pengaturan Berkas Konfigurasi (`.env`)**:
   Salin `.env.example` ke `.env` di root folder dan di folder `backend/`:
   ```powershell
   cp .env.example .env
   cp .env.example backend/.env
   ```
   Pastikan variabel berikut terisi dengan benar:
   - `EXPO_PUBLIC_SUPABASE_URL` / `SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_API_URL` (misal: `http://localhost:5000/api` atau IP jaringan lokal)

4. **Menjalankan Dev Server Metro**:
   ```powershell
   npm run start
   ```

5. **Menjalankan Aplikasi di Android Emulator / Device**:
   ```powershell
   npm run android
   ```

6. **Menjalankan Backend Server (Opsional untuk Local Dev)**:
   ```powershell
   cd backend
   node server.js
   ```

---

## 5. Backend, Database & Supabase Integration

### 5.1 Arsitektur Supabase & Keamanan
- **PostgreSQL Database**:
  - Tabel utama: `users`, `projects`, `project_stages`, `project_notes`, `project_files`, `survey_requests`, dan `notifications`.
  - Definisi skema lengkap berada di `backend/supabase_schema.sql`.
- **Row Level Security (RLS)**:
  - Hak akses data dibatasi langsung di tingkat database PostgreSQL.
  - Role `client`: Hanya dapat mengakses proyek di mana `client_id = auth.uid()` atau `client_name` yang cocok.
  - Role `engineer`: Hanya dapat melihat proyek di mana `engineer_id = auth.uid()` atau `created_by = auth.uid()`.
  - Role `admin` & `marketing`: Memiliki akses luas untuk pembuatan dan klaim survey.
- **PostgreSQL Trigger Utama**:
  - `sync_user_name_changes`: Memastikan ketika `users.name` diubah di profil, nilai `projects.client_name` otomatis ter-update sehingga akses RLS tidak terputus.
  - Skrip SQL terkait: `backend/update_rls_policies.sql`, `backend/add_delete_policies.sql`, `backend/fix_project_client_ids.sql`, dan `backend/fix_booking_notifications.sql`.
- **Supabase Storage Bucket**:
  - Bucket `projects` dikonfigurasi sebagai bucket privat.
  - Pengaksesan berkas teknis dan foto menggunakan Signed URL sementara (`storageService.ts`).

---

### 5.2 Status Fitur Backend & Supabase (Sudah Selesai vs Belum Selesai)

#### A. Yang Sudah Selesai (Completed Features)

1. **Otentikasi & Manajemen Pengguna (Auth & RBAC)**:
   - Integrasi Supabase Auth (email/password login, pendaftaran pengguna baru, dan reset password).
   - Skema peran (`admin`, `marketing`, `engineer`, `client`) dengan kontrol akses di aplikasi dan RLS database.
   - Pendaftaran akun baru oleh Admin melalui modal `AdminRegisterModal.tsx` dan endpoint auth server.

2. **Skema PostgreSQL & Kebijakan Keamanan (RLS & Triggers)**:
   - SELURUH tabel master (`users`, `projects`, `project_stages`, `project_notes`, `project_files`, `survey_requests`, `notifications`) sudah berjalan di Supabase Production/Development.
   - Trigger otomatis sinkronisasi nama pengguna (`sync_user_name_changes`) untuk mencegah hilangnya proyek saat profil disunting.
   - Skrip perbaikan dan pengisian `client_id` otomatis (`fix_project_client_ids.sql`).

3. **Storage Bucket & Management File**:
   - Bucket privat `projects` untuk pengunggahan laporan NDT, sertifikat, dan foto progres harian.
   - Generator Signed URL berjangka waktu di `storageService.ts` untuk pengunduhan file yang aman.

4. **Dual Backend Fallback (Express REST API + SQLite)**:
   - REST API server berbasis Node.js/Express di folder `backend/server.js`.
   - Router mandiri: `authRoutes.js`, `projectRoutes.js`, `bookingRoutes.js`, `fileRoutes.js`, `notificationRoutes.js`.
   - Pengamanan CORS (`allowedOrigins`), rate limiting (`authLimiter`), JWT token middleware, dan Multer file upload handler.
   - Local SQLite database (`gsi_one.db`) dengan script pengisi data awal (`seed_data.js`).

5. **Sinkronisasi Data Real-time (Supabase WebSockets)**:
   - Hook `useProjectRealtime.ts` untuk mendengarkan perubahan instan (*INSERT*, *UPDATE*, *DELETE*) pada tabel proyek, tahapan, dan catatan.

#### B. Yang Belum Selesai / Rencana Pengembangan (Pending & Roadmap)

1. **Push Notification Service (FCM / OneSignal Integration)**:
   - *Status*: Belum Selesai (Dalam Perancangan).
   - *Keterangan*: Notifikasi saat ini tersimpan di tabel database `notifications` dan dapat dibaca di in-app notification center. Namun, pengiriman push notification langsung ke perangkat mobile pengguna saat layar mati (*background service*) via Firebase Cloud Messaging (FCM) atau OneSignal belum dipasang.

2. **Automated Cron Jobs / Supabase Edge Functions**:
   - *Status*: Belum Selesai (Rencana Pengembangan).
   - *Keterangan*: Direktori `supabase/functions/` telah disiapkan. Skrip otomatisasi tingkat server untuk mendeteksi proyek jatuh tempo (*overdue project reminder*) dan pembersihan file temporary belum di-deploy sebagai Edge Functions.

3. **Database Audit Logs & Activity Trail**:
   - *Status*: Belum Selesai.
   - *Keterangan*: Belum ada tabel khusus `audit_logs` untuk mencatat riwayat perubahan data sensitif (misal: siapa yang menghapus file proyek atau mengubah status tahapan proyek secara mendalam).

4. **Offline Synchronization Engine (Offline First)**:
   - *Status*: Belum Selesai.
   - *Keterangan*: Aplikasi memerlukan koneksi internet aktif untuk mutasi data Supabase. Antrean mutasi offline (*offline mutation queue*) belum diintegrasikan dengan database lokal ponsel.

5. **Otomatisasi Pipeline Migrasi Database (Supabase CLI Integration)**:
   - *Status*: Belum Selesai (Eksekusi Manual).
   - *Keterangan*: Skrip SQL saat ini dieksekusi secara manual via Supabase SQL Editor Dashboard. Perlu penyatuan pipeline CI/CD migrasi terstruktur menggunakan Supabase CLI (`supabase db push`).

---

## 6. Standar Penulisan Kode & Konvensi (Coding Standards)

Untuk menjaga skor kualitas codebase tetap di **Grade A**:

1. **Strict TypeScript (Tanpa Casting `any`)**:
   - Semua respons database harus menggunakan pemetaan dari `src/types/database.types.ts` atau DTO eksplisit.
   - Hindari penggunaan type assertion `as any`.

2. **Centralized Helpers (Jangan Membuat Logika Duplikat)**:
   - Pengolahan pesan error: Gunakan `getErrorMessage(error, fallback)` dari `src/utils/errorHelpers.ts`.
   - Pemformatan tanggal & mata uang: Gunakan `formatDateDisplay()`, `formatDateDb()`, `formatCurrency()` dari `src/utils/formatters.ts`.
   - Layout responsif: Gunakan `scale()`, `fontScale()`, `wp()`, `hp()` dari `src/utils/responsive.ts`.

3. **Isolasi Repository**:
   - Jangan pernah melakukan kueri `supabase.from(...)` langsung di dalam komponen UI (`src/screens/` atau `src/components/`).
   - Selalu gunakan `SupabaseProjectRepository` atau custom hook pengelola.

4. **Manajemen Tema Warna**:
   - Selalu gunakan `useRoleTheme()` atau token dari `assets/styles/Colors.tsx` agar tampilan konsisten saat berganti akun role.

---

## 7. Testing, Linting & Build

### 1. Pengecekan Tipe & Linter (Harus Clean sebelum Commit)
```powershell
# Type checking
npm run typecheck

# Code Linting
npm run lint
```

### 2. Menjalankan Unit Test (Jest)
```powershell
# Menjalankan seluruh test suite (59+ tests)
npm test

# Menjalankan test dengan laporan cakupan (coverage)
npm run test:coverage
```

### 3. Membangun Android Release Bundle (.aab / .apk)
```powershell
# Masuk ke direktori android
cd android

# Build AAB untuk Google Play Store
.\gradlew bundleRelease

# Build APK Release untuk testing manual
.\gradlew assembleRelease
```
*Hasil build AAB tersimpan di: `android/app/build/outputs/bundle/release/app-release.aab`*

---

## 8. Troubleshooting & Known Gotchas (Kendala Umum & Solusi)

1. **Data Proyek Tidak Muncul Setelah Edit Profil**:
   - *Penyebab*: `client_name` pada tabel `projects` tidak cocok dengan nama user baru.
   - *Solusi*: Pastikan trigger `sync_user_name_changes` di PostgreSQL aktif. Jika ada proyek lama tanpa `client_id`, jalankan script `backend/fix_project_client_ids.sql`.

2. **Metro Bundler Cache Stale / Error Import Assets**:
   - Jalankan perintah bundler dengan reset cache:
     ```powershell
     npx react-native start --reset-cache
     ```

3. **Gagal Build Android Gradle (JAVA_HOME Error)**:
   - Pastikan variabel lingkungan `JAVA_HOME` mengarah ke JDK 17 (misal: `C:\Program Files\Java\jdk-17`).

---

## 9. Referensi Dokumentasi Tambahan

Dokumentasi proyek lainnya yang tersedia di codebase:
- **`README.md`**: Ringkasan umum proyek dan panduan pengoperasian cepat.
- **`CODEBASE_MAP.md`**: Detail pemetaan menyeluruh setiap file dan modul.
- **`CHANGELOG.md`**: Riwayat perubahan versi aplikasi.
- **`AGENT_HANDOFF.md`**: Catatan sesi pekerjaan dan perbaikan bug terkini.
- **`docs/`**: Dokumentasi sistem formal (SDLC, SRS, Architecture Document, Administrator & User Manual).

---
*Dokumen handover ini dibuat untuk membantu proses onboarding pengembang berjalan lancar dan efisien.*
