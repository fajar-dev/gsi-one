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
 [ Data Sources: Supabase SDK / Edge Functions ]
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
├── supabase/                -- Migrasi, seed, dan Edge Functions
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
   Salin `.env.example` ke `.env` di root folder:
   ```powershell
   cp .env.example .env
   ```
   Pastikan variabel berikut terisi dengan benar:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

4. **Menjalankan Dev Server Metro**:
   ```powershell
   npm run start
   ```

5. **Menjalankan Aplikasi di Android Emulator / Device**:
   ```powershell
   npm run android
   ```

---

## 5. Integrasi Supabase

Data aplikasi berada di PostgreSQL Supabase. Tabel utama: `users`, `projects`, `project_stages`, `stage_updates`, `project_files`, `bookings`, dan `notifications`.

- Skema, policy RLS, indeks, dan trigger berada di `supabase/migrations/`.
- Login memakai Supabase Auth; pembuatan akun oleh admin melalui `supabase/functions/admin-create-user/`.
- `supabase/seed.sql` berisi data demo mandiri dan tidak menghapus data.
- Detail proyek berlangganan perubahan proyek, tahapan, serta catatan melalui `useProjectRealtime`.
- Upload mengirim data langsung ke bucket `projects` dan menyimpan metadata di PostgreSQL. Migrasi terbaru memakai bucket publik; UI membuka URL tersimpan.
- Notifikasi booking dibuat trigger database. Pemanggilan notifikasi dari client merupakan no-op.

Lihat [spesifikasi API](docs/03_Architecture_Design/API_SPECIFICATION_Full.md) untuk kontrak aktif. RLS dapat memberi akses staf yang lebih luas daripada kontrol UI; uji kedua lapisan saat mengubah hak akses.


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
   - *Solusi*: Pastikan relasi `client_id` proyek benar. Perubahan nama tidak menentukan akses RLS.

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
