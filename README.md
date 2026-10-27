# GSI One Mobile Application

Aplikasi Mobile Resmi **PT Graha Survei Indonesia (GSI)** untuk pemantauan proyek survei & penilaian forensic struktur bangunan (*Structural Health Monitoring System & Forensic Engineering*).

---

## Ikhtisar Aplikasi

**GSI One** dikembangkan menggunakan React Native dan TypeScript dengan arsitektur berlapis (*Clean Architecture, Repository Pattern, & Domain-Driven Design*), Zustand state management, serta integrasi real-time Supabase PostgreSQL. Aplikasi ini mendukung **4 Peran Pengguna (User Roles)** dengan hak akses dan antarmuka khusus:

1. **System Administrator (`admin`)**: Pendaftaran user baru dengan role khusus, pembuatan proyek master, pengaturan tahapan timeline, dan pengawasan operasional sistem.
2. **Marketing & Business Development (`marketing`)**: Pengelolaan reservasi survey ("Daftar Survey"), *claim status* pengajuan calon klien, dan portofolio layanan.
3. **Field Engineer (`engineer`)**: Pembaruan progres harian di lapangan, penambahan catatan log harian, dan pengunggahan hasil pengujian NDT/dokumen teknis.
4. **Client / Klien (`client`)**: Pemantauan real-time progres jembatan/gedung, status tahapan inspeksi visual/sensor, dan pengunduhan laporan.

---

## Maintainability & Kualitas Codebase

Quality gate lokal memeriksa batas arsitektur, modul tidak terjangkau dan siklus impor, strict TypeScript, ESLint tanpa warning, format Prettier, serta unit dan integration test. Jalankan `npm run check` sebelum commit. Hasil pengujian lokal tidak menggantikan pengujian perangkat atau hasil CI GitHub.

- Model, validasi, dan kontrak repository berada di `src/domain/`.
- Implementasi query, mapper, profil, dan Storage berada di `src/infrastructure/supabase/`.
- Screen menggunakan hook, store, atau service; tidak mengakses Supabase dan penyimpanan sesi langsung.
- Token warna, spacing, radius, dan tipografi berada di `src/theme/`.
- Mock pengujian berada di `test/mocks/`; adapter browser berada di `src/platform/web/`.

---

## Teknologi Utama

- **Framework**: React Native 0.83+ (CLI) & TypeScript (*Strict Mode*)
- **Arsitektur**: Clean Architecture, OOP Domain Entities, Repository Pattern, Custom Hooks
- **State Management**: Zustand Stores (`authStore.ts`, `projectStore.ts`)
- **Custom Hooks**: `useCreateProjectForm`, `useProjectDetail`, `useSurveyRequests`, `useEditProjectForm`, `useStructureDetail`, `useProfile`, `useProjectRealtime`
- **Database & Realtime Sync**: Supabase PostgreSQL + Realtime WebSockets + Storage Buckets
- **Operasi admin**: Supabase Edge Function `admin-create-user`
- **Testing & CI**: Jest (unit dan integration test) + GitHub Actions quality gate (`lint`, `typecheck`, `test:ci`)
- **UI & Iconography**: Custom Design System (`src/theme/colors.ts`), React Native Vector Icons (Feather), Linear Gradient, SVG

---

## Struktur Proyek Utama

```
gsi-one/
├── __tests__/               -- Automated Unit Test Suites (Domain, Utils, Service, UI)
├── assets/                  -- Aset gambar dan ikon
├── supabase/                -- Migrasi PostgreSQL, Edge Functions, dan seed.sql
├── docs/                    -- Dokumentasi teknis lengkap (SRS, SDLC, Architecture, Deployment)
└── src/
    ├── components/          -- Reusable UI components (ScreenHeader, BottomNav, ErrorBoundary, dll)
    ├── config/              -- Konfigurasi Supabase dan persistensi autentikasi
    ├── domain/              -- Model, kalkulasi progres/statistik, SurveyRequestEntity, role, dan validasi
    ├── infrastructure/      -- Implementasi repository Supabase dan mapper
    ├── platform/            -- Adapter native/web dan registrasi font
    ├── theme/               -- Warna, spacing, tipografi, dan tema role
    ├── hooks/               -- Custom hooks sesi, realtime, proyek, survey, dan pendaftaran
    ├── navigation/          -- AuthenticatedTabs & Root Stack Navigation
    ├── screens/
    │   ├── BookSurvey/      -- Form booking survey & SurveyRequestsScreen (Daftar Survey)
    │   ├── Dashboard/       -- Router & modular views per-role (Admin, Marketing, Engineer, Client)
    │   ├── Home/            -- Landing page publik
    │   ├── Login/           -- Authentication screens (Login, Register, ForgotPassword)
    │   ├── Profile/         -- Profil pengguna & pendaftaran akun oleh Admin
    │   ├── Projects/        -- ProjectListScreen, ProjectDetailScreen, CreateProjectScreen, EditProjectModal
    │   ├── Services/        -- LayananKamiScreen (6 Katalog Layanan Resmi GSI), LayananDetailScreen, & ServicesScreen (Our Experience)
    │   └── Structures/      -- Detail struktur & carousel studi kasus (StructureDetail)
    ├── services/            -- Service facade dan layanan autentikasi/notifikasi
    ├── store/               -- Global Zustand Stores (authStore.ts, projectStore.ts)
    ├── types/               -- TypeScript definitions (database.types.ts, navigation.ts)
    └── utils/               -- Centralized Helpers (errorHelpers, formatters, projectHelpers, userHelpers, responsive)
```

---

## Panduan Pengoperasian & Verifikasi

### 1. Persiapan Environment (.env)
Gunakan Node.js 24 (`.nvmrc`), JDK 17, dan Android SDK sesuai `android/build.gradle`. Instal dependensi dengan `npm ci`.
Salin berkas `.env.example` menjadi `.env` pada folder root:
```bash
cp .env.example .env
```

### 2. Menjalankan Aplikasi Mobile (Android)
```bash
npm run android
```

### 3. Pengecekan Kualitas Kode & Tipe Data
```bash
# Verifikasi TypeScript Type Checking
npm run typecheck

# Verifikasi Code Linting (Harus 0 Error)
npm run lint
```

### 4. Menjalankan Unit Test (Jest)
```bash
npm run test:ci
```

---

## Pengujian Otomatis

Suite Jest mencakup unit test serta integration test untuk pemetaan proyek, pagination, matriks filter RLS per peran, lifecycle notifikasi, signed URL storage, dan alur proyek. CI dikonfigurasi menjalankan `npm ci`, `npm run check`, audit dependensi, build web, dan build APK debug pada push/pull request ke `main`, `master`, `dev`, atau `develop`.

---

## Panduan Deployment Singkat

Signing release dapat dibaca dari `android/signing.properties` yang diabaikan Git, atau properti Gradle `MYAPP_UPLOAD_STORE_FILE`, `MYAPP_UPLOAD_STORE_PASSWORD`, `MYAPP_UPLOAD_KEY_ALIAS`, dan `MYAPP_UPLOAD_KEY_PASSWORD`. Simpan keystore dan kredensial sebagai cadangan privat; gunakan kunci yang sama untuk pembaruan berikutnya.

```bash
# 1. Masuk ke folder android
cd android

# 2. Clean build
./gradlew clean

# 3. Build AAB Produksi (Google Play Console)
./gradlew bundleRelease

# 4. Build APK Produksi (Distribusi Direct)
./gradlew assembleRelease
```
Berkas AAB tersimpan di `android/app/build/outputs/bundle/release/app-release.aab`.
Panduan deployment lengkap dari SDLC hingga Play Console rilis dapat dibaca di **[docs/07_Deployment/Deployment_Guide.md](docs/07_Deployment/Deployment_Guide.md)**.

---

## Dokumentasi Arsitektur Lengkap

- **[Panduan Arsitektur & Refactoring Pengembang](docs/04_Development/Developer_Refactoring_Guide.md)**
- **[Arsitektur Sistem & Alur Kerja SDLC](docs/03_Architecture_Design/Architecture_And_SDLC.md)**
- **[Panduan Deployment Produksi](docs/07_Deployment/Deployment_Guide.md)**
- **[Katalog Lengkap API & Database](docs/03_Architecture_Design/API_Catalog_Documentation.md)**
- **[Spesifikasi API REST](docs/03_Architecture_Design/API_SPECIFICATION_Full.md)**
- **[Peta Codebase Proyek](CODEBASE_MAP.md)**
- **[ADR 0001: Skalabilitas & Keamanan](docs/03_Architecture_Design/ADR/0001-scalability-and-security-architecture.md)**
- **[SLO Baseline](docs/05_Quality_Assurance/SLO/SLO_BASELINE.md)**
